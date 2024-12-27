import "./Button.css";
// size = sm/lg
//color = primary/secondary/destructive

function Button({
  children,
  color = "primary",
  size = "sm",
  shadow = "sh",
  width = "scope",
  opacity = "off",
  onClick,
  disabled,
}) {
  return (
    <button
      className={`btn ${color} ${size} ${shadow} ${width} ${opacity} ${
        disabled ? "off" : opacity
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
export default Button;
