import os

def generate_tree(directory, indent='', ignore_list=None):
    """
    Generates a tree-like representation of the directory structure,
    excluding specified directories.

    Args:
        directory (str): The path to the directory.
        indent (str): The indentation string for the current level.
        ignore_list (list): A list of directory names to ignore.
    """
    if ignore_list is None:
        ignore_list = ['.git', 'node_modules', '.next']  # Default ignore list

    items = [item for item in os.listdir(directory) if item not in ignore_list]
    num_items = len(items)

    for index, item in enumerate(items):
        path = os.path.join(directory, item)
        is_last = index == num_items - 1

        prefix = '└── ' if is_last else '├── '
        print(indent + prefix + item)

        if os.path.isdir(path):
            new_indent = indent + ('    ' if is_last else '│   ')
            generate_tree(path, new_indent, ignore_list)

if __name__ == "__main__":
    project_directory = '.'  # Current directory. Change this if needed.
    ignore_directories = ['.git', 'node_modules', '.next'] # Add more here
    print(os.path.basename(project_directory))
    generate_tree(project_directory, ignore_list=ignore_directories)
