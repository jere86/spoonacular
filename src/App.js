import { useState } from 'react';
import axios from 'axios';
import './App.css';
import RecipesList from "./components/RecipesList";

function App() {
  const [recipesData, setRecipesData] = useState(null);
  const [text, setText] = useState("");

  function handleChange(e) {
    setText(e.target.value);
  }
  
  function getRecipesData () {
    if (text !== ""){
      const ingredients = text.split(/ |,|, /).join(",+");
      axios.get(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=9bd11a9d9e5a4727b2d9fed3489fd620&ingredients=${ingredients}&number=6&ranking=1`)
      .then(res => {
        setRecipesData(res.data);
        console.log(res.data);
      })
      .catch(err => {
        console.log(err.toJSON());
      });
    } else {
      setRecipesData(null);
    }
  }

  return (
    <div className='App'>
      <div className='search'>
        <label>Enter one or more ingredients:</label>
        <input
        type='text'
        placeholder='e.g. "egg, butter, ham"'
        spellCheck={false}
        onChange={handleChange} />
        <button onClick={getRecipesData}>Get Recipes</button>
      </div>
      {recipesData && <RecipesList recipesData={recipesData}/>}
    </div>
  );
}

export default App;
