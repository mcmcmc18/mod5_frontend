import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Redirect } from 'react-router-dom'
// Redux //
import { connect } from 'react-redux';
// Import Components //
import NavBar from './NavBar';
import RestaurantCard from './RestaurantCard';
import { Container, Form, Input, Button, Card } from 'semantic-ui-react'

class RestaurantSignUp extends Component {

  state = {
    cuisine: "",
    location: "",
    rests: [],
    business: "",
    showSearch: true,
    foundBusiness: false,
    username: null,
    password: null,
    redirect: false
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
    this.props.dispatch({ type: "LOGIN_USER_TYPE", payload: "before_restaurant" })
    this.setState({ location: "", cuisine: "" });
    console.log("cuisine", this.state.cuisine)
    console.log("location", this.state.location)
    this.handleSearch(this.state.cuisine, this.state.location)
  }

  // use state to know when to re-direct to restaurant homepage
    setRedirect = () => {
      this.setState({
        redirect: true
      })
    }

    //listening in render() for changed state
    renderRedirect = () => {
        if (this.state.redirect) {
          return <Redirect to='/RestaurantHome' />
        }
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
      })
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
        return (
          <div>
            <h2> Create Account For:  </h2>
            <h1> {restaurant.name} </h1>
            <p>  Address: {restaurant.location.address1} </p>
            <p>  {restaurant.location.city}, {restaurant.location.zip_code} </p>
            <p>  Phone: {restaurant.location.phone} </p>
            <form onSubmit={(e) => this.registerRestaurant(e, restaurant)}>
              <label> Username: </label>
                <br />
              <input onChange={this.handleChange} type="text"  name="username" placeholder="username" value={this.state.username}/>
                <br />
              <label> password: </label>
                <br />
              <input onChange={this.handleChange} type="password"  name="password" placeholder="password" value={this.state.password}/>
                <br />
                <br />
              <button type="submit">Create Account</button>
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
          <Form onSubmit={this.handleSubmit} className="signUp">
           <Form.Field control={Input} className="restSignUp1" label="Business Name"
            placeholder='shake shack' onChange={this.handleChange} type="text" name="cuisine" value={this.state.cuisine}
            />
            <Form.Field control={Input} className="restSignUp2" label="Location"
              placeholder='new york city' onChange={this.handleChange} type="text" name="location" value={this.state.location}
              />
              <br/>
          <div className='centerBtn'>
          <Button type="submit"> Search </Button>
          <br/>
          <br/>
          </div>
          </Form>
        </div>
      )
    } else {
      return null
    }
  }

  registerRestaurant(e, restaurant) {
      e.preventDefault()
      let data = {
        username: this.state.username,
        password: this.state.password,
        name: restaurant.name,
        alias: restaurant.alias,
        yelp_id: restaurant.id,
        image_url: restaurant.image_url,
        url: restaurant.url,
        display_phone: restaurant.display_phone,
        phone: restaurant.phone,
        price: restaurant.price,
        rating: restaurant.rating,
        review_count: restaurant.review_count,
        address1: restaurant.location.address1,
        address2: restaurant.location.address2,
        address3: restaurant.location.address3,
        city: restaurant.location.city,
        zip_code: restaurant.location.zip_code,
        latitude: restaurant.coordinates.latitude,
        longitude: restaurant.coordinates.longitude,
      }

     fetch("http://localhost:3000/api/v1/restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accepts": "application/json"
        },
          body: JSON.stringify(data)
        })
        .then(res => res.json())
          // we need to login at the top level where we are holding our current user!
          // setState in App to currentuser
          .then(response => {
          this.props.dispatch({ type: "LOGIN_USER", payload: response })
          this.props.dispatch({ type: "LOGIN_USER_TYPE", payload: "restaurant" })
          localStorage.setItem('jwt', response.jwt)
          })
          .then(() => this.setRedirect())
          // .then(this.props.history.push(`/RestaurantHome`))
        }

  render() {
    return (
        <div>
          {this.showSearch()}
          <Card.Group centered >
          {this.renderCardsOrForm(this.state.business, this.state.foundBusiness)}
          {this.renderRedirect()}
          </Card.Group>
        </div>
      );
  };
  }

export default connect()(RestaurantSignUp);

function mapStateToProps(state) {
  return {
    current_user: state.current_user,
    user_type: state.user_type,
    allRestaurants: state.allRestaurants,
    allOffers: state.allOffers,
    allCoupons: state.allCoupons,
    newCoupon: state.newCoupon
  }
}
