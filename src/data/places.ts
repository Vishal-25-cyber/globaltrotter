export interface LocalTouristPlace {
    cityName: string;
    name: string;
    description: string;
    image_url: string;
    category: 'adventure' | 'nature' | 'cultural' | 'relaxation' | 'shopping' | 'religious' | 'historical' | 'entertainment';
    entry_fee_inr: number;
    avg_time_hours: number;
}

export const placesData: LocalTouristPlace[] = [
    // Singapore Places
    {
        cityName: "Singapore",
        name: "Universal Studios Singapore",
        description: "Southeast Asia's first and only Universal Studios theme park, featuring thrilling rides, shows, and attractions based on popular blockbuster films and television series.",
        image_url: "https://images.unsplash.com/photo-1524229592284-d6292437637e?w=800",
        category: "entertainment",
        entry_fee_inr: 5800,
        avg_time_hours: 6
    },
    {
        cityName: "Singapore",
        name: "Gardens by the Bay",
        description: "A premier horticultural attraction offering a scenic paradise with the famous Supertree Grove, Flower Dome, and Cloud Forest.",
        image_url: "https://images.unsplash.com/photo-1506351421178-63b52a2d2562?w=800",
        category: "nature",
        entry_fee_inr: 3700,
        avg_time_hours: 4
    },
    {
        cityName: "Singapore",
        name: "Singapore Zoo",
        description: "World-famous 'Open Concept' zoo, setting the standard for animal conservation and offering an immersive wildlife experience.",
        image_url: "https://images.unsplash.com/photo-1551044490-67503f562761?w=800",
        category: "nature",
        entry_fee_inr: 3440,
        avg_time_hours: 5
    },
    {
        cityName: "Singapore",
        name: "Night Safari",
        description: "The world's first nocturnal wildlife park, allowing visitors to observe nocturnal animals in their naturalistic habitats.",
        image_url: "https://images.unsplash.com/photo-1534978805550-ba57a627adbe?w=800",
        category: "adventure",
        entry_fee_inr: 4000,
        avg_time_hours: 3
    },
    {
        cityName: "Singapore",
        name: "S.E.A. Aquarium",
        description: "One of the world's largest aquariums, home to more than 100,000 marine animals representing 1,000 species.",
        image_url: "https://images.unsplash.com/photo-1582201990141-9fb934661073?w=800",
        category: "nature",
        entry_fee_inr: 3800,
        avg_time_hours: 3
    },
    {
        cityName: "Singapore",
        name: "Singapore Flyer",
        description: "A giant observation wheel offering panoramic views of Marina Bay and the cityscape.",
        image_url: "https://images.unsplash.com/photo-1565551323675-81676f27b9f8?w=800",
        category: "entertainment",
        entry_fee_inr: 2800,
        avg_time_hours: 1
    },
    {
        cityName: "Singapore",
        name: "Skyline Luge Sentosa",
        description: "A fun-filled gravity-fuelled thrill ride suitable for all ages.",
        image_url: "https://images.unsplash.com/photo-1596486482594-814d2325bf21?w=800",
        category: "adventure",
        entry_fee_inr: 2400,
        avg_time_hours: 2
    },
    {
        cityName: "Singapore",
        name: "Madame Tussauds Singapore",
        description: "World-famous wax museum featuring lifelike figures of celebrities and historical icons.",
        image_url: "https://images.unsplash.com/photo-1555523907-7dee5292c30b?w=800",
        category: "entertainment",
        entry_fee_inr: 2100,
        avg_time_hours: 2
    },
    {
        cityName: "Singapore",
        name: "Merlion Park",
        description: "A famous landmark and major tourist attraction featuring the iconic Merlion statue.",
        image_url: "https://images.unsplash.com/photo-1542338106-9b76f5f4b50d?w=800",
        category: "cultural",
        entry_fee_inr: 0,
        avg_time_hours: 1
    },
    {
        cityName: "Singapore",
        name: "ArtScience Museum",
        description: "An iconic lotus-shaped museum at Marina Bay Sands, exploring the intersection of art, science, culture, and technology.",
        image_url: "https://images.unsplash.com/photo-1505322101000-19457c432243?w=800",
        category: "cultural",
        entry_fee_inr: 1400,
        avg_time_hours: 2
    }
] as const;
