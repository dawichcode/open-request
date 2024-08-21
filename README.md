# React + OPEN + REQUEST

This a http request package for s.o.l.i.d principle users or clean architecture

## Token Security

Save your platform token in a more secured way. This package saves your login token directly 
to the session storage in an encrypted form with unique fingerprint and cannot be manipulated.
if this token is copied and used on other browsers, authorization will always fail cos the browser.
fingerprint is different.


- Stay `safe`.



## Index OR ROOT configuration

- Configure the top-level `index.html` property like this:

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to open request</title>
</head>
<body>
<div id="root"></div>
<script>
    window.host="http://your_api_end_point_url/";
    window.sub_url="api/";
</script>
<script type="module" src="/src/main.tsx"></script>
</body>
</html>

```

- Create a http request like this`

```jsx
import useAjax from "./hooks/useAjax.tsx";

function App() {
        {/*
          *send: method has three @params send(method,url,data) ,
          *response: takes in the type of data that you need (T)
          *loading: gets the loading property true or false,
          *logout: logs you out from the application,
          *error: handles and return an error response string
          *retries: return number of retries
          *url: endpoint url
        */}

    const {send,retries,response, loading, logout,error}=useAjax<string>(8600)


    return <>
        {/*
          *method: read,create,update,delete,
          *url: endpoint url
        */}
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

```

- Happy hacking`