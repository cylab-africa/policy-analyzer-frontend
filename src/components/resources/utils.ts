export const getRegion = (countryName: string): string => {
    const eastAfrica = [
        "Burundi",
        "Comoros",
        "Djibouti",
        "Eritrea",
        "Ethiopia",
        "Kenya",
        "Madagascar",
        "Mauritius",
        "Rwanda",
        "Seychelles",
        "Somalia",
        "South Sudan",
        "Tanzania",
        "Uganda",
    ];
    const centralAfrica = [
        "Angola",
        "Cameroon",
        "Central African Republic",
        "Chad",
        "Republic of the Congo",
        "Republic of Congo",
        "Democratic Republic of the Congo",
        "Democratic Republic of Congo",
        "Equatorial Guinea",
        "Gabon",
        "São Tomé and Príncipe",
        "Sao Tome and Principe",
        "Sao Tome & Principe",
    ];
    const southernAfrica = [
        "Botswana",
        "Eswatini",
        "Lesotho",
        "Malawi",
        "Mozambique",
        "Namibia",
        "South Africa",
        "Zambia",
        "Zimbabwe",
    ];
    const westAfrica = [
        "Benin",
        "Burkina Faso",
        "Cape Verde",
        "Cabo Verde",
        "Côte d'Ivoire",
        "Ivory Coast",
        "Cote d'Ivoire",
        "Gambia",
        "The Gambia",
        "Ghana",
        "Guinea",
        "Guinea-Bissau",
        "Liberia",
        "Mali",
        "Mauritania",
        "Niger",
        "Nigeria",
        "Senegal",
        "Sierra Leone",
        "Togo",
    ];
    const northAfrica = ["Algeria", "Egypt", "Libya", "Morocco", "Sudan", "Tunisia"];

    if (northAfrica.includes(countryName)) return "North Africa";
    if (westAfrica.includes(countryName)) return "West Africa";
    if (eastAfrica.includes(countryName)) return "East Africa";
    if (centralAfrica.includes(countryName)) return "Central Africa";
    if (southernAfrica.includes(countryName)) return "Southern Africa";
    return "Other";
};


export const getDocumentLanguage = (countryName: string): string => {
        const francophoneCountries = [
            "Benin",
            "Burkina Faso",
            "Burundi",
            "Cameroon",
            "Central African Republic",
            "Chad",
            "Comoros",
            "Congo",
            "Republic of Congo",
            "Democratic Republic of the Congo",
            "Democratic Republic of Congo",
            "Djibouti",
            "Gabon",
            "Guinea",
            "Ivory Coast",
            "Cote d'Ivoire",
            "Madagascar",
            "Mali",
            "Niger",
            "Rwanda",
            "Senegal",
            "Seychelles",
            "Togo",
        ];
        const arabicCountries = ["Algeria", "Egypt", "Libya", "Mauritania", "Morocco", "Sudan", "Tunisia"];
        const portugueseCountries = [
            "Angola",
            "Cape Verde",
            "Cabo Verde",
            "Guinea-Bissau",
            "Mozambique",
            "São Tomé and Príncipe",
            "Sao Tome and Principe",
            "Sao Tome & Principe",
        ];

        if (francophoneCountries.includes(countryName)) return "French";
        if (arabicCountries.includes(countryName)) return "Arabic/French";
        if (portugueseCountries.includes(countryName)) return "Portuguese";
        return "English";
    };


    