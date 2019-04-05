import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
// Redux //
import { connect } from 'react-redux';
// Import Components //
import NavBar from './NavBar';
import RestaurantCard from './RestaurantCard';

class RestaurantSignUp extends Component {

  state = {
    cuisine: "",
    location: "",
    rests: [],
    business: "",
    showSearch: true,
    foundBusiness: false,
    username: null,
    password: null
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.dispatch({ type: "SEARCH_LOC", payload: this.state.location })
    this.props.dispatch({ type: "SEARCH_CUISINE", payload: this.state.cuisine })
    this.setState({ location: "", cuisine: "" });
    console.log("cuisine", this.state.cuisine)
    console.log("location", this.state.location)
    this.handleSearch(this.state.cuisine, this.state.location)
  }

  handleSearch = (cuisine, location) => {
   const data = {cuisine: cuisine, location: location };
   return fetch("http://localhost:3000/api/v1/search", {
       method: "POST",
       headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
   .then(res => res.json())
   .then(results => {this.setState ({
     rests: results
      }, () => console.log("did this work?", this.state.rests))
    })
    this.renderSearchCards()
  }

  mapStateToProps(state) {
    return {
      keyword: state.keyword,
    }
    console.log("here", state.keyword)
  }

  renderSearchCards = () => {
    if (this.state.rests.length == 0) {
      return null
    } else {
      return this.state.rests.businesses.map(rest => {
        return (
        <RestaurantCard restaurant={rest}
        selectRestaurant={this.selectRestaurant}
        />
        )
      })
    }
  }

  selectRestaurant = (business) => {
    this.setState({
      business: business,
      foundBusiness: true,
      showSearch: false
    })
  }

  renderCardsOrForm = (restaurant, foundBusiness) => {
      if (this.state.foundBusiness === false){
          return this.renderSearchCards()
      } else {
        debugger
        return (
          <div>
            <h2> Create Account For:  </h2>
            <h1> {restaurant.name} </h1>
            <p>  Address: {restaurant.location.address1} </p>
            <p>  {restaurant.location.city}, {restaurant.location.zip_code} </p>
            <p>  Phone: {restaurant.location.phone} </p>
            <form>
              <label> Username: </label>
                <br />
              <input onChange={this.handleChange} type="text"  name="username" placeholder="username" value={this.state.username}/>
                <br />
              <label> password: </label>
                <br />
              <input onChange={this.handleChange} type="password"  name="password" placeholder="password" value={this.state.password}/>
                <br />
            </form>
          </div>
        )
      }
    }

  showSearch = () => {
    if (this.state.showSearch === true) {
      return (
        <div>
          <h1> Find Your Business </h1>
          <form onSubmit={this.handleSubmit}>
          Business Name: <input type="text" value={this.state.cuisine} name="cuisine" onChange={this.handleChange} />
          Location: <input type="text" value={this.state.location} name="location" onChange={this.handleChange} />
          <input type="submit" value="Submit" />
          </form>
        </div>
      )
    } else {
      return null
    }
  }

  render() {
    return (
      <div>

        {this.showSearch()}
        {this.renderCardsOrForm(this.state.business, this.state.foundBusiness)}

      </div>
    );
  };

  }

export default connect()(RestaurantSignUp);