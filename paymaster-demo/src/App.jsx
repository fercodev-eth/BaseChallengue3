import "./App.css"
import ClaimReward from "./components/ClaimReward"

function App() {
    return (
        <div className="app-container">
            <header>
                <h1>Base Account <span className="highlight"></span></h1>
                <p className="subtitle">Claim Reward with Gasless transactions</p>
            </header>
            <main>
                <ClaimReward />
            </main>
        </div>
    )
}
export default App