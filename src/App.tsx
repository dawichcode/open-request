import useAjax from "./hooks/useAjax.tsx";
import useOnce from "./hooks/useOnce.tsx";

function App() {
  const {send,response,retries, loading, logout,error}=useAjax<string>(8600)

  //shipped with use once custom hook
  useOnce(() => {
    console.log("hello");
  })

  return <>
  <button onClick={() => send({method:"read",url:"user/10?page=1"})}>
    Send
  </button>
    {loading&&<p>loading...</p>}
    {response&&<div>{response}</div>}
    {error&&<div>{error}</div>}
    {retries&&<div>{retries}</div>}

    <button onClick={()=>logout()}>Logout</button>
  </>
}

export default App
