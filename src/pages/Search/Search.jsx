import React, { useState, useContext } from "react";
import { AppContext } from "../../context/appContext";

import styles from "./Search.module.scss";

import { getRequest } from "../../helpers/http";
import {
  cuisineOptions,
  dietOptions,
  intolerancesOptions,
  showOptions,
  typeOptions,
} from "../../data/filterOptions";

import RecipesList from "../../components/RecipesList/RecipesList";
import Filter from "../../components/Filter/Filter";

const Search = () => {
  const { recipesData, setRecipesData } = useContext(AppContext);
  const [ingredients, setIngredients] = useState(null);
  const [cuisine, setCuisine] = useState(null);
  const [mealtype, setMealType] = useState(null);
  const [diet, setDiet] = useState(null);
  const [intolerances, setIntolerances] = useState(null);
  const [number, setNumber] = useState(4);

  const handleIngredients = (e) => {
    setIngredients(e.target.value.split(/ |,|, /).join(",+"));
  };

  const handleCuisine = (e) => {
    setCuisine(e.target.value);
  };

  const handleMealType = (e) => {
    setMealType(e.target.value);
  };

  const handleDiet = (e) => {
    setDiet(e.target.value);
  };

  const handleIntolerances = (e) => {
    setIntolerances(e.target.value);
  };

  const handleShowPerSearch = async (e) => {
    setNumber(e.target.value);

    const recipes = await getRequest("recipes/complexSearch", {
      number: e.target.value,
      includeIngredients: ingredients,
      instructionsRequired: true,
      cuisine: cuisine,
      type: mealtype,
      diet: diet,
      intolerances: intolerances,
    });

    setRecipesData(recipes);
  };

  const getRecipesData = async () => {
    const recipes = await getRequest("recipes/complexSearch", {
      number: number,
      includeIngredients: ingredients,
      instructionsRequired: true,
      cuisine: cuisine,
      type: mealtype,
      diet: diet,
      intolerances: intolerances,
    });

    setRecipesData(recipes);
  };

  return (
    <div className={styles.search}>
      <div className={styles.searchbar}>
        <label htmlFor="ingredients">Enter one or more ingredients:</label>
        <input
          id="ingredients"
          name="ingredients"
          type="text"
          placeholder='e.g. "egg, butter, ham"'
          spellCheck={false}
          onChange={handleIngredients}
        />
      </div>
      <div className={styles.filters}>
        <Filter
          filterName="Cuisine"
          onChange={handleCuisine}
          options={cuisineOptions}
          emptySpot={true}
        />
        <Filter
          filterName="Meal Type"
          onChange={handleMealType}
          options={typeOptions}
          emptySpot={true}
        />
        <Filter
          filterName="Diet"
          onChange={handleDiet}
          options={dietOptions}
          emptySpot={true}
        />
        <Filter
          filterName="Intolerances"
          onChange={handleIntolerances}
          options={intolerancesOptions}
          emptySpot={true}
        />
      </div>
      <button onClick={getRecipesData} className={styles.getRecipes}>
        Get Recipes
      </button>
      {recipesData && (
        <p>
          Number of recipes found:{" "}
          {recipesData ? `${recipesData.totalResults}` : "0"}.
        </p>
      )}
      <Filter
        filterName="Show"
        onChange={handleShowPerSearch}
        options={showOptions}
        emptySpot={false}
      />
      {recipesData && <RecipesList recipesData={recipesData} />}
    </div>
  );
};

export default Search;
