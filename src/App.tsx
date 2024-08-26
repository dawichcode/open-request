import React from "react";
import useAjax from "./hooks/useAjax";
import useOnce from "./hooks/useOnce";
import PropertyError from "./utils/propertyError";

function App() {
  {
    /*
     *send: method has three @params send(method,url,data) ,
     *response: takes in the type of data that you need (T)
     *loading: gets the loading property true or false,
     *logout: logs you out from the application,
     *error: handles and return an error response string
     *retries: return number of retries
     *url: endpoint url
     */
  }
  const { send, response, retries, errors, loading, logout, error } =
    useAjax<string>(8600);

  //shipped with use once custom hook  that can be recalled
  const trigger = useOnce(() => {});

  return (
    <>
      {/*
       *method: read,create,update,delete,
       *url: endpoint url
       */}
      <button
        onClick={() => {
          send({ method: "create", url: "auth/login", data: {} });
        }}
      >
        Send
      </button>
      {loading && <p>loading...</p>}
      {response && <div>{response}</div>}
      {error && <div>{error}</div>}
      {retries && <div>{retries}</div>}
      {errors && (
        <ul>
          <h2>errors</h2>
          {(errors as PropertyError)?.password?.map((e: string, i: number) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      )}

      <button
        onClick={() => {
          logout();
          //recalling the function  from the custom hook
          trigger();
        }}
      >
        Logout
      </button>
    </>
  );
}

export default App;
