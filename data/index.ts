

export const adminCategories = [
    {
        id: 1,
        name: "Engine Parts",
        status: "active",
        featured: true,
        type: "Tractor",
    },
    {
        id: 2,
        name: "Transmission",
        status: "active",
        featured: false,
        type: "Tractor",
    },
    {
        id: 3,
        name: "Hydraulic Systems",
        status: "disabled",
        featured: false,
        type: "Tractor",
    },
    {
        id: 4,
        name: "Precision Components",
        status: "active",
        featured: true,
        type: "Engineering",
    },
    {
        id: 5,
        name: "Custom Tooling",
        status: "active",
        featured: false,
        type: "Engineering",
    },
];

export const adminRoutes = [
    { name: "Categories", href: "/admin/categories", routeName: "/categories" },
    { name: "Parts", href: "/admin/parts", routeName: "/parts" },
    { name: "Engineering", href: "/admin/engineering", routeName: "/engineering" },

];
export const userRoutes = [
    { name: "Engineering", href: "/engineering", routeName: "/engineering" },
    { name: "Tractor Parts", href: "/tractor-parts", routeName: "/tractor-parts" },
    { name: "About", href: "/about", routeName: "/about" },
    { name: "Contact", href: "/contact", routeName: "/contact" },
];