import os
import json
from datetime import datetime

def analyze_folder_structure(start_path):
    """
    რეკურსიულად აანალიზებს ფოლდერის სტრუქტურას და აბრუნებს dictionary-ს
    """
    structure = {}
    
    # გამოსატოვებელი ფოლდერები და ფაილები
    ignore_dirs = {'.git', 'node_modules', '.next', 'out', 'build', '.vscode', '__pycache__'}
    ignore_files = {'.DS_Store', '.env', '.env.local'}
    
    try:
        # მიმდინარე ფოლდერის შიგთავსის წაკითხვა
        items = os.listdir(start_path)
        
        for item in items:
            item_path = os.path.join(start_path, item)
            
            # თუ ფოლდერი ან ფაილი გამოსატოვებელია, გამოტოვება
            if item in ignore_dirs or item in ignore_files:
                continue
                
            if os.path.isdir(item_path):
                # რეკურსიულად გაანალიზება ქვეფოლდერების
                structure[item] = {
                    'type': 'directory',
                    'content': analyze_folder_structure(item_path)
                }
            else:
                # ფაილის ინფორმაციის შენახვა
                file_size = os.path.getsize(item_path)
                file_ext = os.path.splitext(item)[1]
                
                structure[item] = {
                    'type': 'file',
                    'extension': file_ext,
                    'size': f"{file_size / 1024:.2f} KB"
                }
    
    except Exception as e:
        print(f"შეცდომა მოხდა {start_path}-ის ანალიზისას: {str(e)}")
        return {}
    
    return structure

def save_structure_to_log(structure, project_path):
    """
    შედეგების შენახვა ლოგ ფაილში
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    log_filename = f"folder_structure_{timestamp}.log"
    
    def format_structure(struct, indent=0):
        result = []
        for name, info in struct.items():
            prefix = "    " * indent
            if info['type'] == 'directory':
                result.append(f"{prefix}📁 {name}/")
                result.extend(format_structure(info['content'], indent + 1))
            else:
                result.append(f"{prefix}📄 {name} ({info['extension']}, {info['size']})")
        return result
    
    try:
        with open(log_filename, 'w', encoding='utf-8') as f:
            f.write(f"Next.js პროექტის ფოლდერის სტრუქტურის ანალიზი\n")
            f.write(f"პროექტის მისამართი: {project_path}\n")
            f.write(f"თარიღი: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write("\n" + "="*50 + "\n\n")
            
            formatted_structure = format_structure(structure)
            f.write("\n".join(formatted_structure))
            
        print(f"\nლოგ ფაილი შეიქმნა: {log_filename}")
        
    except Exception as e:
        print(f"შეცდომა მოხდა ლოგ ფაილის შექმნისას: {str(e)}")

def main():
    # მიმდინარე სამუშაო ფოლდერის მიღება
    project_path = os.getcwd()
    print(f"მიმდინარეობს ფოლდერის ანალიზი: {project_path}")
    
    # ფოლდერის სტრუქტურის ანალიზი
    structure = analyze_folder_structure(project_path)
    
    # შედეგების შენახვა ლოგში
    save_structure_to_log(structure, project_path)

if __name__ == "__main__":
    main()