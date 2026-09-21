import "./App.css";

function App() {
  const handleClick = () => {
    chrome.runtime.sendMessage({ action: "hello" });
  };
  return (
    <section id="center">
      <h1>Reoverlay</h1>
      <button onClick={handleClick}>Click me</button>
    </section>
  );
}

export default App;
