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

When signed in as an administrator, use the Edit, Delete and Hide from public
controls on sale, rental, open land, commercial, file merging and construction service cards. An Admin Logged In indicator appears on every page;
click it to log out. Hidden cards remain visible to the administrator
and can be shown again. Edits, deletions, visibility and added properties are
stored in the current browser only. They are not shared across browsers or
devices, and the client-side login and visibility controls are not secure
access control. A backend with server-side authentication is required before
using this to manage real public listings.

The six properties in `src/components/SaleListings.tsx` are explicitly labelled
fictional demos with placeholder images and sample prices, not live inventory.
No third-party reference listings or photos are published. Replace the demo data
with approved property details and photos before launch; then update the demo
notices and the `noindex, nofollow` metadata in `src/routes/sale.tsx`.

## Rental listings

The homepage's **Rented Houses** card opens `/rent`. The page displays fictional
demo rentals with sample monthly prices and placeholder images. Replace them
with approved details and photos before launch, and update the demo notice and
`noindex, nofollow` metadata in `src/routes/rent.tsx`.

## Construction

The homepage's **Construction** card opens `/construction`, which lists the
construction services and links to the existing inquiry form. No third-party
construction photos, logos or contact details are published.

## Open land

The homepage's **Open Land** card opens `/open-land`. It starts empty; an admin
can add plots with their title, location, price, area and description, and can
edit, delete or hide them. As with other cards, plots are stored only in the
current browser and are not securely hidden from other users of that browser.

## Commercial and file merging

The homepage links to `/commercial` and `/file-merging`. Both start empty and
provide the same browser-local add, edit, delete and visibility controls as
Open Land, with separate listings for each page.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
