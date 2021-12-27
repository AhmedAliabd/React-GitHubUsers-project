import { createContext, useReducer } from "react";
import githubReducer from "./githubReducer";

const GithubContext = createContext();
const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(githubReducer, initialState);
  const searchFetchUsers = async (text) => {
    setLoading();
    const params = new URLSearchParams({ q: text });
    const response = await fetch(`${GITHUB_URL}/search/users?${params}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });

    const { items } = await response.json();

    dispatch({ type: "GET-USERS", payload: items });
  };
  const setLoading = () => dispatch({ type: "SET-LOADING" });
  const clear = () =>
    dispatch({
      type: "CLEAR-USERS",
    });
  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        loading: state.loading,
        searchFetchUsers,
        clear,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
