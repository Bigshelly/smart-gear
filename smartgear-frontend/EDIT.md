# SmartGear Frontend - Beginner Customization Guide

This guide is designed for team members who are learning to code and want to safely customize the visual appearance of the SmartGear frontend without breaking any functionality.

## Getting Started with Editing

### What You Can Safely Change
- Colors, fonts, and visual styling
- Spacing, margins, and padding
- Images and icons
- Text content and labels
- Button appearances and sizes

### What NOT to Touch
- JavaScript logic (functions, state management)
- Import statements
- Component structure (JSX elements)
- Props and event handlers
- API calls and data handling

### Before You Start
1. **Make sure the app is running**: `npm run dev`
2. **Test your changes**: Always check the browser after making changes
3. **Use Git**: Save your work with commits so you can undo mistakes
4. **Start small**: Make one change at a time and test it

### Testing Your Changes
```bash
# Always have the development server running
npm run dev

# Check for errors
npm run lint

# Test the production build
npm run build
```

## Color Customization

### Understanding the Color System

The SmartGear app uses a CSS variable-based color system defined in `src/index.css`. Colors automatically support both light and dark modes.

### Main Color Variables

Located in `src/index.css`:

```css
:root {
  --background: 0 0% 100%;           /* Main background color */
  --foreground: 222.2 84% 4.9%;      /* Main text color */
  --primary: 221.2 83.2% 53.3%;      /* Brand color (blue) */
  --primary-foreground: 210 40% 98%; /* Text on primary color */
  --secondary: 210 40% 96%;          /* Light gray */
  --muted: 210 40% 96%;              /* Muted backgrounds */
  --accent: 210 40% 96%;             /* Accent color */
  --destructive: 0 84.2% 60.2%;      /* Error/danger color (red) */
  --border: 214.3 31.8% 91.4%;       /* Border color */
  --ring: 221.2 83.2% 53.3%;         /* Focus ring color */
}
```

### How to Change Theme Colors

#### Method 1: Change CSS Variables (Recommended)

Edit `src/index.css` to change the main theme:

```css
/* Example: Change to a green theme */
:root {
  --primary: 142 76% 36%;        /* Green primary color */
  --primary-foreground: 355 100% 99%;
}

/* Example: Change to a purple theme */
:root {
  --primary: 262 83% 58%;        /* Purple primary color */
  --primary-foreground: 210 40% 98%;
}
```

#### Method 2: Use Tailwind Color Classes

In any component file, you can override colors using Tailwind classes:

```jsx
// Change button color from primary to green
<Button className="bg-green-600 hover:bg-green-700">
  Buy Now
</Button>

// Change text color
<h1 className="text-blue-600">SmartGear</h1>

// Change background color
<div className="bg-purple-100">
  Content here
</div>
```

### Safe Color Combinations

When changing colors, use these tested combinations:

```css
/* Blue Theme (Default) */
--primary: 221.2 83.2% 53.3%;
--primary-foreground: 210 40% 98%;

/* Green Theme */
--primary: 142 76% 36%;
--primary-foreground: 355 100% 99%;

/* Purple Theme */
--primary: 262 83% 58%;
--primary-foreground: 210 40% 98%;

/* Orange Theme */
--primary: 24.6 95% 53.1%;
--primary-foreground: 60 9.1% 97.8%;

/* Red Theme */
--primary: 346.8 77.2% 49.8%;
--primary-foreground: 355.7 100% 97.3%;
```

### Common Color Classes

```jsx
// Background colors
className="bg-blue-500"     // Blue background
className="bg-red-500"      // Red background
className="bg-green-500"    // Green background

// Text colors
className="text-blue-600"   // Blue text
className="text-gray-600"   // Gray text
className="text-white"      // White text

// Border colors
className="border-blue-500" // Blue border
className="border-gray-300" // Gray border
```

## Typography Changes

### Text Size Classes

```jsx
// Headings
className="text-xs"      // 12px
className="text-sm"      // 14px
className="text-base"    // 16px (default)
className="text-lg"      // 18px
className="text-xl"      // 20px
className="text-2xl"     // 24px
className="text-3xl"     // 30px
className="text-4xl"     // 36px
className="text-5xl"     // 48px
className="text-6xl"     // 60px
```

### Font Weight Classes

```jsx
className="font-thin"      // 100
className="font-light"     // 300
className="font-normal"    // 400 (default)
className="font-medium"    // 500
className="font-semibold"  // 600
className="font-bold"      // 700
className="font-extrabold" // 800
```

### Text Alignment

```jsx
className="text-left"      // Left align
className="text-center"    // Center align
className="text-right"     // Right align
```

### Where to Find Text Elements

#### Homepage Title (`src/pages/Home.jsx`)
```jsx
// Line 44-47
<h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
  Welcome to{' '}
  <span className="text-primary">SmartGear</span>
</h1>
```

#### Product Card (`src/components/ProductCard.jsx`)
Look for text elements like:
```jsx
<h3 className="font-semibold text-lg">Product Name</h3>
<p className="text-muted-foreground">Category</p>
<p className="text-2xl font-bold text-primary">Price</p>
```

#### Header (`src/components/Header.jsx`)
```jsx
<h1 className="text-2xl font-bold">SmartGear</h1>
```

### Example Typography Changes

```jsx
// Make homepage title larger
<h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">

// Change product name font weight
<h3 className="font-bold text-xl">Product Name</h3>

// Make price text larger
<p className="text-3xl font-bold text-primary">Price</p>
```

## Layout Adjustments

### Spacing Classes

#### Margin (space outside elements)
```jsx
className="m-4"      // All sides: 16px
className="mt-4"     // Top: 16px
className="mr-4"     // Right: 16px
className="mb-4"     // Bottom: 16px
className="ml-4"     // Left: 16px
className="mx-4"     // Left and right: 16px
className="my-4"     // Top and bottom: 16px
```

#### Padding (space inside elements)
```jsx
className="p-4"      // All sides: 16px
className="pt-4"     // Top: 16px
className="pr-4"     // Right: 16px
className="pb-4"     // Bottom: 16px
className="pl-4"     // Left: 16px
className="px-4"     // Left and right: 16px
className="py-4"     // Top and bottom: 16px
```

#### Spacing Scale
```jsx
className="p-1"      // 4px
className="p-2"      // 8px
className="p-3"      // 12px
className="p-4"      // 16px
className="p-6"      // 24px
className="p-8"      // 32px
className="p-12"     // 48px
className="p-16"     // 64px
```

### Component Sizing

#### Width
```jsx
className="w-full"     // 100% width
className="w-1/2"      // 50% width
className="w-1/3"      // 33.33% width
className="w-1/4"      // 25% width
className="w-64"       // 256px fixed width
```

#### Height
```jsx
className="h-full"     // 100% height
className="h-64"       // 256px fixed height
className="h-screen"   // 100vh (full screen)
```

### Mobile Responsiveness Basics

Tailwind uses breakpoint prefixes:

```jsx
// Default (mobile): applies to all screen sizes
className="text-sm"

// Small screens and up (640px+)
className="sm:text-base"

// Medium screens and up (768px+)
className="md:text-lg"

// Large screens and up (1024px+)
className="lg:text-xl"
```

#### Example: Responsive Text
```jsx
<h1 className="text-2xl md:text-4xl lg:text-6xl">
  SmartGear
</h1>
```

#### Example: Responsive Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Products */}
</div>
```

## Image and Icon Updates

### Product Images

Product images are defined in `src/data/products.js`:

```javascript
{
  id: 1,
  name: "iPhone 15 Pro Max",
  image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&q=80",
  // ... other properties
}
```

#### To Change Product Images:
1. Open `src/data/products.js`
2. Replace the `image` URL with your new image URL
3. Make sure the new image is approximately 400px wide for best results

### Icons (Lucide React)

The app uses Lucide React icons. Common icons include:

```jsx
import { 
  Smartphone, 
  Laptop, 
  Headphones, 
  ShoppingCart, 
  User, 
  Search,
  ArrowLeft,
  ArrowRight 
} from 'lucide-react'

// Usage in components
<Smartphone className="h-6 w-6" />
<ShoppingCart className="h-4 w-4 text-blue-500" />
```

#### Icon Size Classes:
```jsx
className="h-4 w-4"    // 16px
className="h-5 w-5"    // 20px
className="h-6 w-6"    // 24px
className="h-8 w-8"    // 32px
```

### Logo Customization

The logo is text-based in `src/components/Header.jsx`:

```jsx
<h1 className="text-2xl font-bold text-primary">
  SmartGear
</h1>
```

#### To Change the Logo:
1. Replace "SmartGear" with your text
2. Or replace the entire element with an image:

```jsx
<img 
  src="/path/to/your/logo.png" 
  alt="Your Logo" 
  className="h-8"
/>
```

## Component Styling

### Button Styling (`src/components/ui/button.jsx`)

Buttons use variant classes. To customize:

```jsx
// In any component file
<Button variant="default" size="lg" className="bg-green-600 hover:bg-green-700">
  Custom Button
</Button>

// Available variants
variant="default"    // Primary blue
variant="outline"    // Outlined
variant="ghost"      // Transparent
variant="secondary"  // Gray

// Available sizes
size="sm"           // Small
size="default"      // Medium
size="lg"           // Large
```

### Card Styling (`src/components/ui/card.jsx`)

Cards are containers. Customize in component files:

```jsx
<Card className="p-6 rounded-lg border-2 border-blue-200 bg-blue-50">
  <CardHeader>
    <CardTitle className="text-blue-800">Custom Card</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Product Card (`src/components/ProductCard.jsx`)

Key styling areas:

```jsx
// Main card container (around line 15)
<Card className="overflow-hidden transition-shadow hover:shadow-lg">

// Product image (around line 20)
<img 
  className="w-full h-48 object-cover"
  src={product.image}
/>

// Product name (around line 30)
<h3 className="font-semibold text-lg text-foreground">
  {product.name}
</h3>

// Price (around line 35)
<p className="text-2xl font-bold text-primary">
  {formatPrice(product.price, product.currency)}
</p>
```

### Header Styling (`src/components/Header.jsx`)

```jsx
// Main header container
<header className="border-b bg-background">

// Logo/title
<h1 className="text-2xl font-bold text-primary">
  SmartGear
</h1>
```

## Safe Editing Practices

### What NOT to Touch

#### Avoid Editing These Parts:

1. **Import statements** (top of files)
```jsx
// DON'T TOUCH
import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
```

2. **Function definitions and logic**
```jsx
// DON'T TOUCH
const [products, setProducts] = useState([])
const handleClick = () => { /* logic */ }
```

3. **Props and data handling**
```jsx
// DON'T TOUCH
{products.map(product => (
  <ProductCard key={product.id} product={product} />
))}
```

4. **Event handlers**
```jsx
// DON'T TOUCH
onClick={handlePurchase}
onSubmit={handleFormSubmit}
```

#### Safe to Edit:

1. **CSS classes**
```jsx
// SAFE TO CHANGE
className="text-blue-600 font-bold text-xl"
```

2. **Text content**
```jsx
// SAFE TO CHANGE
<h1>Your New Title Here</h1>
<p>Your description text</p>
```

3. **Image URLs**
```jsx
// SAFE TO CHANGE
src="https://your-new-image-url.com/image.jpg"
alt="Your new alt text"
```


### How to Undo Mistakes with Git

```bash
# See what files you've changed
git status

# Undo changes to a specific file
git checkout -- src/components/ProductCard.jsx

# Undo all changes since last commit
git checkout -- .

# Save your current changes
git add .
git commit -m "Updated button colors"
```

## Common Customizations

### Button Styles and Colors

#### Change Button Colors
```jsx
// Green buttons
<Button className="bg-green-600 hover:bg-green-700 text-white">
  Buy Now
</Button>

// Red buttons  
<Button className="bg-red-600 hover:bg-red-700 text-white">
  Delete
</Button>

// Outline buttons
<Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50">
  Learn More
</Button>
```

#### Button Sizes
```jsx
// Large buttons
<Button size="lg" className="px-8 py-4 text-lg">
  Big Button
</Button>

// Small buttons
<Button size="sm" className="px-3 py-1 text-sm">
  Small Button
</Button>
```

### Card Appearances

#### Colored Cards
```jsx
<Card className="bg-blue-50 border-blue-200">
  <CardContent className="p-6">
    Blue themed card
  </CardContent>
</Card>

<Card className="bg-green-50 border-green-200">
  <CardContent className="p-6">
    Green themed card
  </CardContent>
</Card>
```

#### Cards with Shadows
```jsx
<Card className="shadow-lg hover:shadow-xl transition-shadow">
  <CardContent>
    Card with shadow effect
  </CardContent>
</Card>
```

### Header/Footer Styling

#### Header Background Colors
In `src/components/Header.jsx`:
```jsx
<header className="border-b bg-blue-600 text-white">
  {/* Header content */}
</header>

<header className="border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
  {/* Gradient header */}
</header>
```

#### Footer Styling
In `src/components/Layout.jsx`:
```jsx
<footer className="border-t py-8 mt-16 bg-gray-100">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center text-sm text-gray-600">
      {/* Footer content */}
    </div>
  </div>
</footer>
```

### Product Card Designs

#### Rounded Corners
```jsx
<Card className="rounded-xl overflow-hidden">
  {/* Product content */}
</Card>
```

#### Hover Effects
```jsx
<Card className="transition-transform hover:scale-105 hover:shadow-lg">
  {/* Product content */}
</Card>
```

#### Custom Spacing
```jsx
<CardContent className="p-8">
  {/* More padding inside cards */}
</CardContent>
```



### Tasks

6. **Customize product card appearance**
   - File: `src/components/ProductCard.jsx`
   - Add border colors, shadows, or background colors

7. **Update the color theme**
   - File: `src/index.css`
   - Change the `--primary` color variable

8. **Modify the homepage layout**
   - File: `src/pages/Home.jsx`
   - Adjust grid columns or spacing classes

9. **Style the checkout form**
   - File: `src/components/CheckoutForm.jsx`
   - Customize form field appearance

10. **Update footer styling**
    - File: `src/components/Layout.jsx`
    - Add background colors or modify text


11. **Create custom button variants**
    - File: `src/components/ui/button.jsx`
    - Add new variant styles

12. **Implement responsive design changes**
    - Any component file
    - Add mobile-specific styling with `sm:`, `md:`, `lg:` prefixes

13. **Custom card layouts**
    - Product and checkout components
    - Experiment with different grid layouts

14. **Typography system updates**
    - Multiple component files
    - Create consistent font sizing across the app

15. **Theme customization**
    - File: `src/index.css`
    - Create a completely custom color scheme

