import { ShoppingBag, Home, Devices, Movie, HealthAndSafety, SportsMotorsports, Category } from '@mui/icons-material';

export const LOCATIONS = [
    'Bahen',
    'University College',
    'Hart House',
    'Sid Smith',
    'Myhal',
    'Robarts'
];

export const CONDITIONS = [
    'New',
    'Used - Like New',
    'Used - Good',
    'Used - Fair',
];

export const SORT_OPTIONS = [
    'Suggested',
    'Date Listed: Newest First',
    'Date Listed: Oldest First',
    'Price: Lowest First',
    'Price: Highest First'
]

export const SORT_OPTIONS_MAPPING = {
    'Date Listed: Newest First': "date_desc",
    'Date Listed: Oldest First': "date_asc",
    'Price: Lowest First': "price_asc",
    'Price: Highest First': "price_desc"
}

export const DATE_LISTED = [
    'All',
    'Last 24 Hours',
    'Last 7 Days',
    'Last 30 Days'
]

export const CATEGORIES = new Map([
    ['Clothing & Accessories', {
      icon: <ShoppingBag />,
      subcategories: ['Accessories', 'Menswear', 'Womenswear', 'Baby & Kids', 'Shoes']
    }],
    ['Home & Living', {
      icon: <Home />,
      subcategories: ['Furniture', 'Home Decor', 'Appliances', 'Tools & Hardware']
    }],
    ['Electronics', {
      icon: <Devices />,
      subcategories: ['Computers & Tablets', 'Phones & Accessories']
    }],
    ['Entertainment', {
      icon: <Movie />,
      subcategories: ['Books, Movies & Music', 'Games & Puzzles']
    }],
    ['Health & Beauty', {
      icon: <HealthAndSafety />,
      subcategories: ['Skincare & Makeup', 'Haircare & Beauty Tools', 'Health & Wellness']
    }],
    ['Outdoors & Sports', {
      icon: <SportsMotorsports />,
      subcategories: ['Bicycles & Vehicles', 'Sports & Gear']
    }],
    ['Miscellaneous', {
      icon: <Category />,
      subcategories: ['Vintage & Collectibles', 'Arts & Crafts', 'Other']
    }]
  ]);