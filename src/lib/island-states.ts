// African Union island members are only a few pixels wide at continental scale, so the maps
// draw a small marker for each one to give it a visible, hoverable target.
// Names match the country records; coordinates are [longitude, latitude].
export const ISLAND_STATES: { name: string; coordinates: [number, number] }[] = [
    { name: "Cabo Verde", coordinates: [-24.01, 16.01] },
    { name: "Sao Tome & Principe", coordinates: [6.96, 0.87] },
    { name: "Comoros", coordinates: [43.88, -11.87] },
    { name: "Seychelles", coordinates: [55.46, -4.67] },
    { name: "Mauritius", coordinates: [57.55, -20.25] },
];
