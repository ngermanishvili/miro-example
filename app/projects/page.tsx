import React from 'react';

const SplitContainer = () => {
    const measurements = Array(6).fill("Living Room.............. 47 sqm.");

    return (
        <div className="h-screen w-full flex mt-24">
            {/* Left Panel */}
            <div className="w-1/2 h-full border-r border-gray-200 overflow-y-auto ">
                <div className="p-8">
                    <div className="pt-20 lg:pr-8 space-y-8">
                        {/* Header Section */}
                        <div className="space-y-6">
                            <div className="w-full">
                                <h1 className="text-2xl md:text-3xl font-bold mb-2">FLOATING VILLA</h1>
                                <div className="w-full h-0.5 bg-black"></div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex gap-2">
                                    <p className="font-semibold">LOCATION:</p>
                                    <p>Dubai, United Arab Emirates</p>
                                </div>
                                <div className="flex gap-2">
                                    <p className="font-semibold">FUNCTION:</p>
                                    <p>Residential</p>
                                </div>
                                <div className="flex gap-2">
                                    <p className="font-semibold">AREA:</p>
                                    <p>678 sqm</p>
                                </div>
                                <div className="flex gap-2">
                                    <p className="font-semibold">YEAR:</p>
                                    <p>2024</p>
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="space-y-4">
                            <h2 className="font-semibold">DESCRIPTION:</h2>
                            <div className="space-y-4 text-gray-700">
                                <p>
                                    This 500 m² villa in Dubai, designed by our team, blends modern
                                    architecture with a focus on sustainability and spatial quality. The open-plan
                                    layout features floor-to-ceiling windows that maximize natural light and
                                    offer stunning views, while spacious living areas and bedrooms provide
                                    comfort and flexibility.
                                </p>
                                <p>
                                    Greenery elements on the façade create a natural connection, enhancing
                                    both aesthetics and environmental performance. We've used sustainable
                                    materials and energy-efficient solutions to reduce the villa's footprint.
                                </p>
                                <p>
                                    The villa's private swimming pool and landscaped gardens offer seamless
                                    indoor-outdoor living, ideal for Dubai's climate. Our design fosters a
                                    balanced, sustainable living environment with luxury and harmony.
                                </p>
                            </div>
                        </div>

                        {/* Programme Section */}
                        <div className="space-y-8">
                            <h2 className="font-semibold text-xl md:text-2xl">Programme:</h2>

                            {/* Ground Floor */}
                            <div className="space-y-6">
                                <h3 className="font-semibold">Ground Floor</h3>
                                <img src="/assets/r1.png" alt="Ground Floor Plan" className="w-full rounded-lg shadow-md" />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        {measurements.slice(0, 3).map((measurement, idx) => (
                                            <div key={`left-${idx}`} className="text-gray-700 text-sm md:text-base">{measurement}</div>
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        {measurements.slice(3, 6).map((measurement, idx) => (
                                            <div key={`right-${idx}`} className="text-gray-700 text-sm md:text-base">{measurement}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* First Floor */}
                            <div className="space-y-6 pb-8">
                                <h3 className="font-semibold">First Floor</h3>
                                <img src="/assets/r2.png" alt="Ground Floor Plan" className="w-full rounded-lg shadow-md" />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        {measurements.slice(0, 3).map((measurement, idx) => (
                                            <div key={`left-${idx}`} className="text-gray-700 text-sm md:text-base">{measurement}</div>
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        {measurements.slice(3, 6).map((measurement, idx) => (
                                            <div key={`right-${idx}`} className="text-gray-700 text-sm md:text-base">{measurement}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>

            {/* Right Panel */}
            <div className="w-1/2 h-full overflow-y-auto mt-4">
                <div className="p-8 space-y-8">
                    <img src="/assets/p1.png" alt="Exterior View 1" className="w-full rounded-lg shadow-md" />
                    <img src="/assets/p2.png" alt="Exterior View 2" className="w-full rounded-lg shadow-md" />
                    <img src="/assets/p3.png" alt="Pool View 2" className="w-full rounded-lg shadow-md" />
                    <img src="/assets/p4.png" alt="Pool View 3 " className="w-full rounded-lg shadow-md" />
                    <img src="/assets/p5.png" alt="Pool View 4" className="w-full rounded-lg shadow-md" />


                </div>
            </div>
        </div>
    );
};

export default SplitContainer;