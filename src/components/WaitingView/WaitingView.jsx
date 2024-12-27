import ReactLoading from "react-loading";
import "./WaitingView.css";

export function WaitingView() {
  return (
    <div className="waitingview">
      <ReactLoading type="spin" color="#635FC7" height={100} width={100} />
      <h2 style={{ color: "#635FC7" }}>Loading...</h2>
    </div>
  );
}
