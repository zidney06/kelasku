export default function Loading() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="border rounded p-3 text-center w-100 mx-3">
        <h3 className="loading-dots">Loading</h3>
      </div>
    </div>
  );
}
