export const appData = {
    name: "GBMC",
    contactEmail: "info@gbmc.com",
    conatcNumber: "+1 718 222 2222",
    address: {
        street_address: "123 Main Street",
        postal_code: "10001",
        city: "New York",
        district: "Pine Avenue",
        country: "United States"
    }
};

export const envVar = {
    JWT_SECRET: "123_gbmc_jwt_secret_123",
    ADMIN_EMAIL: "admin@admin.com",
    ADMIN_PASSWORD: "admin123",
    NEXT_PUBLIC_BASE_URL: process.env.NODE_ENV === 'production' ? 'https://gbmc-fe.vercel.app/' : 'http://localhost:3000'
};