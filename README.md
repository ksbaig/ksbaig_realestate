# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Sale listings

The homepage's **Houses for Sale** card opens `/sale`. The page includes
case-insensitive search by name, size or location, price sorting, a reset action
and links to the existing homepage inquiry form.

The six properties in `src/components/SaleListings.tsx` are explicitly labelled
fictional demos with placeholder images and sample prices, not live inventory.
No third-party reference listings or photos are published. Replace the demo data
with approved property details and photos before launch; then update the demo
notices and the `noindex, nofollow` metadata in `src/routes/sale.tsx`.

## Rental listings

The homepage's **Rented Houses** card opens `/rent`. Until approved rental details
and permission to publish matching photos are provided, the page displays a
"Rental listings coming soon" message and links to the existing inquiry form.
No reference photos, unconfirmed availability or invented rental prices are
published. Provide each home's title, location, monthly PKR rent, size, bedrooms,
bathrooms, availability and matching approved photos before adding listings.
Update the coming-soon copy and `noindex, nofollow` metadata in
`src/routes/rent.tsx` when approved listings are ready to launch.

## Construction

The homepage's **Construction** card opens `/construction`, which lists the
construction services and links to the existing inquiry form. No third-party
construction photos, logos or contact details are published.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
