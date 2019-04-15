import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import OfferCard from './OfferCard'
import { Grid, Modal, Radio, Container, Form, Select, List, Input, Divider, Button, Header, Icon, Label, Image, Menu, Segment, Sidebar, Card } from 'semantic-ui-react'



class RestaurantHome extends Component {

  state = {
    offer: "",
    earn_month: "",
    redeem_month: "",
    showCouponForm: false,
    allOffers: "",
    animation: 'scale down',
    direction: 'left',
    dimmed: false,
    visible: false,
    displayContent: 'coupon',
    displayHeader: 'Your Offers',
    open: false
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSelectChange = (e, data) => {
    console.log("handling select change")
    this.setState({
      [data.name]: data.value
    })
  }

  updateContent = (content, header) => {
    this.setState({
      displayContent: content,
      displayHeader: header
    })
  }

  renderOfferDescription = (passedOffer) => {
    this.setState({
      offer: passedOffer
    })
  }

  createOffer = (e) => {
    e.preventDefault()
    let data = {
      restaurant_id: this.props.current_user.id,
      offer: this.state.offer,
      earn_month: this.state.earn_month,
      redeem_month: this.state.redeem_month
    }
    fetch("http://localhost:3000/api/v1/offers", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         "Accepts": "application/json"
       },
         body: JSON.stringify(data)
       })
       .then(res => res.json())
       .then(res => {
         this.setState( prevState => {
           return { allOffers: [...prevState.allOffers, res], open: true, offer: ""}
         })
       })
     }

     close = () => {
       this.setState({ open: false })
       this.updateContent('coupon', 'Your Offers')
     }

     offerSuccess = () => {
       if (this.state.open === true) {
       return (
       <Fragment>
       <Modal size={'tiny'} open={this.state.open} onClose={this.close}>
       <Modal.Header>Congratulations! Get Ready for Business! </Modal.Header>
       <Modal.Content>
       <p> Your offer has been added to Meal Deals. </p>
       </Modal.Content>
       <Modal.Actions>
       <Button onClick={() => this.close()} positive icon='checkmark' labelPosition='right' content='Got It!' />
       </Modal.Actions>
       </Modal>
       </Fragment>
     )
   }
   else {
     return null
   }
     }

 componentDidMount = () => {
     fetch("http://localhost:3000/api/v1/offers")
     .then(res => res.json())
     .then(res =>
       this.setState({
         allOffers: res
       }, () => console.log(this.state.allOffers))
     )
   }


  renderRestOffers = () => {
    if (this.state.allOffers == "") {
      return (
        <Fragment>
        <p> You do not have any offers. </p>
        <br/><br/><br/><br/><br/><br/><br/><br/>
        </Fragment>
      )
    }
    else {
    // let allMonths = ["jan", "feb", "mar", "april", "may", "june", "july", "aug", "sept", "oct", "nov", "dec"]
    let ResOffers = this.state.allOffers.filter(res => res.restaurant_id === this.props.current_user.id)
    // let sortedRes0ffers = ResOffers.sort(function(a,b){
    //   return allMonths.indexOf(a) - allMonths.indexOf(b);
    // })
    return ResOffers.map(offer => {
      return <OfferCard offer={offer} />
    })
  }
}

  renderCouponForm = () => {
    const monthOptions = [
      { key: 'January', text: 'January', value: 0, name: 'earn_month'},
      { key: 'February', text: 'February', value: 1, name: 'earn_month'},
      { key: 'March', text: 'March', value: 2, name: 'earn_month'},
      { key: 'April', text: 'April', value: 3, name: 'earn_month'},
      { key: 'May', text: 'May', value: 4, name: 'earn_month'},
      { key: 'June', text: 'June', value: 5, name: 'earn_month'},
      { key: 'July', text: 'July', value: 6 },
      { key: 'August', text: 'August', value: 7 },
      { key: 'September', text: 'September', value: 8},
      { key: 'October', text: 'October', value: 9 },
      { key: 'November', text: 'November', value: 10 },
      { key: 'December', text: 'December', value: 11 },
    ]

    let offer1 = "$10 OFF A $50 PURCHASE OR MORE"
    let offer2 = "BUY ONE APPETIZER, GET ONE FREE"
    let offer3 = "10% OFF YOUR ENTIRE MEAL"
      return (
        <div className="form">
          <h4> Valid At: </h4>
          <List>
            <List.Item>
              <List.Icon name='food' />
              <List.Content>{this.props.current_user.name} </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name='marker' />
              <List.Content>{this.props.current_user.address1}, {this.props.current_user.city} {this.props.current_user.zip_code} </List.Content>
            </List.Item>
          </List>

          <Form onSubmit={(e)=>this.createOffer(e)}>

          <Segment style={{height: '900px;'}} >
            <Grid columns={2}  >
              <Grid.Column>
                <Container fluid className="EarnMonth">
                  <h2> Earn Month </h2>
                  <h4>Customers will check-in at your restaurant during this month </h4> <br/> <br/> <br/>
                  <Form.Field control={Select} placeholder='Select Earn Month' name='earn_month' options={monthOptions} onChange={(e, data) => this.handleSelectChange(e, data)}/><br/> <br/>
                </Container>
              </Grid.Column>
            <Grid.Column verticalAlign='middle'>
              <Container fluid className="RedeemMonth">
                <h2> Redeem Month </h2>
                <h4> Customers will redeem coupon offers this month </h4>
                <p> **Restaurant must be willing to accept all activated offers. </p> <br/>
                <Form.Field control={Select} placeholder='Select Redeem Month' name="redeem_month"  options={monthOptions} onChange={(e, data) => this.handleSelectChange(e, data )}/><br/> <br/>
              </Container>
              </Grid.Column>
              </Grid>
              <Divider vertical>AND</Divider>
              </Segment>


          <Container fluid className="description">
          <h2 className="offerTitle"> Offer Description </h2>
          <h4> Suggested Offers </h4>
          <List divided verticalAlign='middle'>

          <List.Item>
          <List.Content floated='right'>
          <Button type="button" onClick={() => this.renderOfferDescription(offer1)}>Use This Offer</Button>
          </List.Content>
          <List.Content> {offer1} </List.Content>
          </List.Item>

          <List.Item>
          <List.Content floated='right'>
          <Button type="button" onClick={() => this.renderOfferDescription(offer2)}>Use This Offer</Button>
          </List.Content>
          <List.Content> {offer2} </List.Content>
          </List.Item>
          <List.Item>

          <List.Content floated='right'>
          <Button type="button" onClick={() => this.renderOfferDescription(offer3)}>Use This Offer</Button>
          </List.Content>
          <List.Content> {offer3} </List.Content>
          </List.Item>
          </List>

          <Form.Field floated='center' control={Input} label='Offer Description'
             name="offer" value={this.state.offer} onChange={(e) => this.handleChange(e)}/><br/>
          <div className='centerBtn'>

          <Form.Field control={Button} content='Submit Offer'type="submit" />
          </div>
          </Container>
        </Form>
      </div>
      )
  }

    renderContent = () => {
    if (this.state.displayContent === 'coupon') {
         return (
          <div>
          <h1> {this.props.current_user.name} </h1>
          {this.renderRestOffers()}
          </div>
      )
    } else if (this.state.displayContent === 'food') {
      return (
        this.renderCouponForm()
      )
    } else if (this.state.displayContent === 'setting'){
      console.log("this will update user info")
    }
  }


  render () {
    debugger
    const { activeItem } = this.state
    const { animation, dimmed, direction, visible } = this.state
    const vertical = direction === 'bottom' || direction === 'top'
    console.log("user is...", this.props.current_user)
    let current_user = this.props.current_user
    return (
      <Sidebar.Pushable as={Segment} className="sideNav">
        <Sidebar as={Menu} animation='scale down' icon='labeled' vertical visible width='thin'>
          <Menu.Item as='a' className="navContent1" onClick={() => this.updateContent('coupon', 'Your Offers')}>
          <Icon name='cut' />
           My Offers
          </Menu.Item >
          <Menu.Item as='a' className="navContent" onClick={() => this.updateContent('food', 'Submit a New Offer')}>
            <Icon name='food' />
            Submit A New Offer
          </Menu.Item>
          <Menu.Item as='a' className="navContent" onClick={() => this.updateContent('setting')}>
            <Icon name='setting' />
            Settings
          </Menu.Item>
        </Sidebar>
        <Sidebar.Pusher>
          <Segment basic dimmed={dimmed && visible}>
            <div className="welcomeBack">
            <h1> Welcome Back {current_user.name} ! </h1>
            </div>
            <Divider />
            <h2> {this.state.displayHeader}</h2>
            <Divider />
            {this.renderContent()}
            {this.offerSuccess()}
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )
  }


}

export default connect(mapStateToProps)(RestaurantHome)



function mapStateToProps(state) {
  return {
    current_user: state.current_user
  }
}
