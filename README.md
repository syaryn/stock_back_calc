# Stock Target Price Calculator (Reverse Calculator)

A simple yet powerful tool to calculate the theoretical stock price based on
your target financial indicators (PER, PBR, and Dividend Yield).

This application allows investors to input a stock's current price and financial
metrics, then adjust target indicators to reverse-calculate the price that
satisfies all conditions. It automatically identifies the most conservative
target price (the "bottleneck") among the valid calculations.

## Key Features

- **Reverse Calculation**: Input target PER, PBR, or Yield to see the implied
  stock price.
- **Bottleneck Detection**: Automatically highlights which indicator is
  restricting the target price (the most conservative valuation).
- **Real-time Synchronization**: As you type or slide, results update instantly.
- **Deep Linking**: The URL updates in real-time with your inputs properly
  encoded. You can bookmark or share the URL to return to the exact same
  calculation state.
- **Localization**: Full support for English and Japanese (auto-detected or
  manually toggled).
- **Implied Metrics**: Displays the implied PER, PBR, and Yield at the
  calculated target price.

## Tech Stack

- **Runtime**: Deno
- **Framework**: Hono (SSR with JSX)
- **Frontend Logic**: Alpine.js
- **Styling**: Pico.css (Class-less / Minimal CSS)
- **Tooling**: Mise (Task runner)

## Getting Started

### Prerequisites

- [Deno](https://deno.land/) (v1.40+)
- [Mise](https://mise.jdx.dev/) (Optional, for task management)

### Development

To start the development server:

```bash
mise run start
# or
deno task start
```

Open your browser at `http://localhost:8000`.

### Testing

Run the test suite (integration and unit tests):

```bash
mise run check
# or
deno task check
```

## Usage Guide

1. **Enter Current Values**: Input the stock's current price, PER, PBR, and
   Dividend Yield.
2. **Set Targets**: Use the inputs or sliders to set your target valuation
   metrics.
   - The `Target` fields will automatically sync with `Current` values until you
     manually modify them.
3. **View Results**: The tool calculates the target price based on each metric.
   - **Result Price**: The lowest price among the calculations (conservative
     estimate).
   - **Restricted by**: Indicates which metric is the limiting factor
     (bottleneck).
   - **Implied Metrics**: Shows what the PER, PBR, and Yield would be at that
     target price.

## License

MIT
