export interface TemperatureProps {
  value?: number;
  unit?: "C" | "F";
  maxDigits?: number;
  showUnit?: boolean;
  round?: boolean;
}

export default function Temperature({
  value = 0,
  unit = "F",
  maxDigits = 0,
  showUnit = false,
  round = true,
}: TemperatureProps): React.ReactElement {
  const roundedValue = round ? Math.round(value) : value;
  const formattedValue = roundedValue.toFixed(maxDigits);

  return (
    <>
      {formattedValue}&deg;
      {showUnit && unit}
    </>
  );
}
