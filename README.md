# Menu digital MVP (Next.js + TypeScript)

MVP mobile-first para un menu digital con carrito y envio del pedido a WhatsApp.

## Instalacion

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abrir `http://localhost:3000/menu`.

## Build y lint

```bash
npm run lint
npm run build
```

## Editar configuracion

Datos editables:

- `src/data/config.json`
  - `businessName`
  - `whatsappNumber` (con pais, sin +)
  - `currency` (ej: PEN, USD)
  - `deliveryFee` (opcional)
  - `minOrder` (opcional)
  - `hoursText`
  - `addressText` (opcional)
  - `lockTableFromUrl` (default true)
  - `orderTypesEnabled` (`mesa`, `pickup`, `delivery`)
- `src/data/menu.json`
  - Productos, variantes y extras.

## QR recomendado

- Menu principal: `/menu`
- Menu con mesa fija: `/menu?mesa=12`

Ejemplo de link completo:

```
https://tu-dominio.vercel.app/menu?mesa=12
```

## WhatsApp

Se genera un mensaje con detalles del pedido y se abre:

```
https://wa.me/<NUMERO>?text=<TEXTO_ENCODED>
```

Para pruebas, reemplaza `whatsappNumber` en `src/data/config.json`.

## Pruebas recomendadas

- Android Chrome
- iOS Safari
- Flujo: agregar simple, agregar con variante requerida, extras con maxSelect, editar item.
- Validaciones: entrega incompleta, pedido minimo y mesa bloqueada por URL.
