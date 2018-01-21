import React, { Component } from "react";
import "jquery";
  
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import "./Home.css";
import "../libs/font-awesome/css/font-awesome.css";
import "../libs/Ionicons/css/ionicons.css";
import "../libs/select2/css/select2.min.css";
import { signOutUser } from "../libs/awsLib";
import config from "../config";
import ReactGA from 'react-ga';
import {LandlordModel} from '../models/LandlordModel';
import {ComplaintsModel} from '../models/ComplaintsModel';
import {DisputesModel} from '../models/DisputesModel';
import {PropertyModel} from '../models/PropertyModel';
import {LandlordReviewModel} from '../models/LandlordReviewModel';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import '../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import Select from 'react-select';
import Dropdown from 'react-dropdown'
import {PieChart} from 'react-easy-chart';
import { ScaleLoader } from 'react-spinners';

export default class Landing extends Component {
   constructor(props) {
    super(props);
    // this.landlordObj = props.landlordObject;
    this.showMe = false;
    this.userLoggedIn = JSON.parse(sessionStorage.getItem('userLoggedIn'));

    if(!this.userLoggedIn){
      this.showMe = false;
      this.props.history.push("/");
    } else {
      this.showMe = true;
    }
    this.myProps = props;
    // this.landlordObj = JSON.parse(sessionStorage.getItem('landlordObject'));

    // if(!this.landlordObj){
    //   this.showMe = false;
    //   this.props.history.push("/");
    // } else {
    //   this.showMe = true;
    // }

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      propertySearchField: null,
      landlordSearchField: null,
      propertySearchLocation: null,
      landlordResultsClass:["landlord-result-hidden"],
      landlordSearchAddressField: null,
      selectedDropDownOption: "Address",
      landingSearchField: null,
      searchTableTitle: "Property Results",
      loading:false,
      wrapperClass: []
    };
    
    this.headerpanelClass = ["headerpanel-right d-lg-block d-none"];
    this.headerOption = true;
    this.houseImage1 = "https://s3.amazonaws.com/rentvent-web/1.jpg";
    this.houseImage2 = "https://s3.amazonaws.com/rentvent-web/2.jpg";
    this.houseImage3 = "https://s3.amazonaws.com/rentvent-web/3.jpg";
    this.houseImage4 = "https://s3.amazonaws.com/rentvent-web/4.jpg";
    this.houseImage5 = "https://s3.amazonaws.com/rentvent-web/5.jpg";
    this.houseImage6 = "https://s3.amazonaws.com/rentvent-web/6.jpg";
    this.profileImage1 = "https://s3.amazonaws.com/rentvent-web/7.jpg";
    this.profileImage2 = "https://s3.amazonaws.com/rentvent-web/8.jpg";
    this.profileImage3 = "https://s3.amazonaws.com/rentvent-web/9.jpg";
    this.backgroundImage = "https://s3.amazonaws.com/rentvent-web/12.jpg";
    this.longBeachImage = "https://s3.amazonaws.com/rentvent-web/long-beach.jpg";
    this.beverlyHillsImage = "https://s3.amazonaws.com/rentvent-web/beverly-hills.jpg";
    this.manhattanImage = "https://s3.amazonaws.com/rentvent-web/manhattan.jpg";
    this.pasadenaImage = "https://s3.amazonaws.com/rentvent-web/pasadena.jpg";
    this.santaMonicaImage = "https://s3.amazonaws.com/rentvent-web/santa-monica.jpg";
    this.westHollywoodImage = "https://s3.amazonaws.com/rentvent-web/west-hollywood.jpg";

    this.landlordLink = ["nav-link active"];
    this.propertyLink = ["nav-link"];
    this.landlordTab = ["tab-pane active show"];
    this.propertyTab = ["tab-pane"];
    this.landlords = [];
    this.landlordsDataSource = [];
    this.landlordResultsRowSelected = this.landlordResultsRowSelected.bind(this);
    this.landlordSearchCriteria = "Address";
    this.options = {
      onRowClick: this.landlordResultsRowSelected
    };
    this.val1 = 19;
    this.val2 = 81;
    this.dropDownOptions = [
      'Address', 'Landlord Name'
      ];

  }

  landlordResultsRowSelected = row =>{
        var selectedLandlord = this.landlords[row.index];
        if(this.landlordSearchCriteria == "Address"){
          this.retrievelandlordIDDetails(selectedLandlord.pid);
        } else {
          this.retrievelandlordDetails(selectedLandlord.landlordId);
        }
  }

  retrievelandlordIDDetails = landlordId => {
    try{
     const GATEWAY_URL = config.apis.LANDLORD_PID_GET+landlordId;
     this.setLoadingIndicator(true);
     fetch(GATEWAY_URL, {
         method: 'GET',
         mode: 'cors'
     })
      .then((response) => {
                   return response.json();
               })
               .then((json) => {
                var landlord;
                var jsonObj = json.resultlist;
                 if(json && jsonObj && jsonObj.length > 0){
                  landlord = new LandlordModel;
                          var landlordObj = jsonObj[0];
                          landlord.landlordId = landlordObj.L_ID ? landlordObj.L_ID : "";
                          this.retrievelandlordDetails(landlord.landlordId);
                          this.setLoadingIndicator(false);
                          } else {
                            this.setLoadingIndicator(false);
                            alert("No property details found");
                          }
                })
               .catch((err) => {
                this.setLoadingIndicator(false);
                console.log('There was an error:' + err);alert("Landlord retrieve error");})
             } catch (e) {
              this.setLoadingIndicator(false);
                console.log('There was an error:'+e); 
                alert("Landlord error");
        }

  }

  dropDownSelected = val => {
    console.log("Selected: " + val);
    this.setState({ selectedDropDownOption: val });
    if(val){
      this.landlordSearchCriteria = val.value;
    } else {
      this.landlordSearchCriteria = "";
    }
  }

  setLoadingIndicator = val => {
    if(val){
      this.setState({ wrapperClass: ["overlay-wrapper"] });
    } else {
      this.setState({ wrapperClass: [] });
    }
    this.setState({ loading: val });
  }
  
  retrievelandlordDetails = landlordId => {
    try{
     const GATEWAY_URL = config.apis.LANDLORD_LID_GET+landlordId;
      this.setLoadingIndicator(true);
     fetch(GATEWAY_URL, {
         method: 'GET',
         mode: 'cors'
     })
      .then((response) => {
                   return response.json();
               })
               .then((json) => {
                var landlord;
                 if(json && json.Items && json.Items.length > 0){
                  landlord = new LandlordModel;
                  var landlordObj = json.Items[0];
                          landlord.addressLine1 = landlordObj.L_Address_Line1 ? landlordObj.L_Address_Line1 : "";

                          landlord.fullName = landlordObj.L_Full_Name ? landlordObj.L_Full_Name : "";;
                          landlord.addressLine1 = landlordObj.L_Address_Line1 ? landlordObj.L_Address_Line1 : "";
                          landlord.addressLine2 = landlordObj.L_Address_Line2 ? landlordObj.L_Address_Line2 : "";
                          landlord.approval = landlordObj.L_Approval ? landlordObj.L_Approval : "";
                          landlord.avgApproval = landlordObj.L_Avg_Approval ? landlordObj.L_Avg_Approval : "";
                          landlord.avgRating = landlordObj.L_Avg_Rating ? landlordObj.L_Avg_Rating : "";
                          landlord.avgResponsiveness = landlordObj.L_Avg_Responsiveness ? landlordObj.L_Avg_Responsiveness : "";
                          landlord.city = landlordObj.L_City ? landlordObj.L_City : "";
                          landlord.country = landlordObj.L_Country ? landlordObj.L_Country : "";
                          landlord.county = landlordObj.L_County ? landlordObj.L_County : "";
                          landlord.inquiries = landlordObj.L_Inquiries ? landlordObj.L_Inquiries : "";
                          landlord.phone = landlordObj.L_Phone ? landlordObj.L_Phone : "";
                          landlord.rating = landlordObj.L_Rating ? landlordObj.L_Rating : "";
                          landlord.recommend = landlordObj.L_Recommend ? landlordObj.L_Recommend : "";
                          landlord.repair = landlordObj.L_Repair ? landlordObj.L_Repair : "";
                          landlord.repairRequests = landlordObj.L_Repair_Requests ? landlordObj.L_Repair_Requests : "";
                          landlord.state = landlordObj.L_State ? landlordObj.L_State : "";
                          landlord.title = landlordObj.L_Title ? landlordObj.L_Title : "";
                          landlord.zipCode = landlordObj.L_Zipcode ? landlordObj.L_Zipcode : "";
                          landlord.landlordId = landlordObj.L_ID ? landlordObj.L_ID : "";
                          landlord.createdBy = landlordObj.L_Created_By ? landlordObj.L_Created_By : "";
                          landlord.createdOn = landlordObj.L_Created_On ? landlordObj.L_Created_On : "";
                          landlord.updatedBy = landlordObj.L_Updated_By ? landlordObj.L_Updated_By : "";
                          landlord.updatedOn = landlordObj.L_Updated_On ? landlordObj.L_Updated_On : "";
                          landlord.description = landlordObj.L_Description ? landlordObj.L_Description : "";

                          var complaintsObj = landlordObj.L_Complaints ? landlordObj.L_Complaints : "";
                            landlord.complaints = [];
                          if(complaintsObj){
                            for(var i=0; i< complaintsObj.length; i++){
                              landlord.complaints[i] = new ComplaintsModel;
                              landlord.complaints[i].cid = complaintsObj[i];
                            }
                          }

                          var disputesObj = landlordObj.L_Disputes ? landlordObj.L_Disputes : "";
                          if(disputesObj){
                              landlord.disputes = [];
                            for(var i=0; i< disputesObj.length; i++){
                              landlord.disputes[i] = new DisputesModel;
                            landlord.disputes[i].did = disputesObj[i];
                          }
                        }

                          var propertiesObj = landlordObj.L_Properties ? landlordObj.L_Properties : "";
                          if(propertiesObj){
                              landlord.landlordProperties = [];
                            for(var i=0; i< propertiesObj.length; i++){
                              landlord.landlordProperties[i] = new PropertyModel;
                              var propChildObj = propertiesObj[i];
                              landlord.landlordProperties[i].pAdd1 = propChildObj.P_Address_Line1 ? propChildObj.P_Address_Line1 : "N/A";
                              landlord.landlordProperties[i].pAdd2 = propChildObj.P_Address_Line2 ? propChildObj.P_Address_Line2 : "N/A";
                              landlord.landlordProperties[i].pCity = propChildObj.P_City ? propChildObj.P_City : "N/A";
                              landlord.landlordProperties[i].pid = propChildObj.P_ID ? propChildObj.P_ID : "";
                              landlord.landlordProperties[i].pState = propChildObj.P_State ? propChildObj.P_State : "N/A";
                              landlord.landlordProperties[i].pZip = propChildObj.P_Zipcode ? propChildObj.P_Zipcode : "N/A";
                              landlord.landlordProperties[i].pCounty = propChildObj.P_County ? propChildObj.P_County : "";
                              landlord.landlordProperties[i].pCreatedBy = propChildObj.P_Created_By ? propChildObj.P_Created_By : "";
                              landlord.landlordProperties[i].pCreatedOn = propChildObj.P_Created_On ? propChildObj.P_Created_On  : "";
                              landlord.landlordProperties[i].pCountry = propChildObj.P_Country ? propChildObj.P_Country : "";
                              landlord.landlordProperties[i].pAvgApproval = propChildObj.P_Approval_Rate ? propChildObj.P_Approval_Rate : "";
                              landlord.landlordProperties[i].pAvgRating = propChildObj.P_Avg_Rating ? propChildObj.P_Avg_Rating : "";
                              landlord.landlordProperties[i].pReviews = propChildObj.P_Reviews ? propChildObj.P_Reviews : "";
                              landlord.landlordProperties[i].pUpdatedBy = propChildObj.P_Updated_By ? propChildObj.P_Updated_By : "";
                              landlord.landlordProperties[i].pUpdatedOn = propChildObj.P_Updated_On ? propChildObj.P_Updated_On : "";
                              landlord.landlordProperties[i].pRCount = propChildObj.PR_Count ? propChildObj.PR_Count : "";
                              landlord.landlordProperties[i].prRating = propChildObj.PR_Rating ? propChildObj.PR_Rating : "";
                            }
                          }
                          
                          var reviewsObj = landlordObj.Landlord_Reviews ? landlordObj.Landlord_Reviews : "";
                          if(reviewsObj){
                              landlord.landlordReviews = [];
                            for(var i=0; i< reviewsObj.length; i++){
                                landlord.landlordReviews[i] = new LandlordReviewModel;
                                var propChildObj = reviewsObj[i];
                                landlord.landlordReviews[i].lrCreatedDate = propChildObj ? propChildObj.LR_Created_Date : "";
                                landlord.landlordReviews[i].lrDescription = propChildObj ? propChildObj.LR_Description : "";
                                landlord.landlordReviews[i].lrTitle = propChildObj ? propChildObj.LR_Title : "";
                                landlord.landlordReviews[i].lrtid = propChildObj ? propChildObj.T_ID : "";
                                landlord.landlordReviews[i].lrid = propChildObj ? propChildObj.ID : "";
                                landlord.landlordReviews[i].lrlpid = propChildObj ? propChildObj.LP_L_ID : "";
                                landlord.landlordReviews[i].lrApproval = propChildObj ? propChildObj.LR_Approval : "";
                                landlord.landlordReviews[i].lrCreatedBy = propChildObj ? propChildObj.LR_Created_By : "";
                                landlord.landlordReviews[i].lrRating = propChildObj ? propChildObj.LR_Rating : "";
                                landlord.landlordReviews[i].lrRepairRequests = propChildObj ? propChildObj.LR_Repair_Requests : "";
                                landlord.landlordReviews[i].lrResponsiveness = propChildObj ? propChildObj.LR_Responsiveness : "";
                                landlord.landlordReviews[i].lrType = propChildObj ? propChildObj.LR_Types : "";
                                landlord.landlordReviews[i].lrUpdatedBy = propChildObj ? propChildObj.LR_Updated_By : "";
                                landlord.landlordReviews[i].lrUpdatedOn = propChildObj ? propChildObj.LR_Updated_On : "";
                                landlord.landlordReviews[i].lrtState = propChildObj ? propChildObj.T_State : "";
                                landlord.landlordReviews[i].lrtCity = propChildObj ? propChildObj.T_City : "";

                                
                            }
                          }
                          this.setLoadingIndicator(false);
                          sessionStorage.setItem('landlordObject', JSON.stringify(landlord));
                  this.props.userHasAuthenticated(true);
                  ReactGA.event({
                          category: 'Navigation',
                          action: 'Landlord',
                      });
                  this.props.history.push("/landlord");
                 } else {
                  this.setLoadingIndicator(false);
                  alert("No landlord details found");
                }
                 
                          
                })
               .catch((err) => {
                this.setLoadingIndicator(false);
                console.log('There was an error:' + err);alert("Landlord retrieve error");})
             } catch (e) {
                console.log('There was an error:'+e); 
                alert("Landlord error");
                this.setLoadingIndicator(false);
        }

  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  menuSelected() {
    if(this.headerOption == false) {
      this.headerpanelClass = ["headerpanel-right d-lg-block d-none"];
    } else {
      this.headerpanelClass = ["headerpanel-right d-lg-block"];
    }
    this.headerOption = !this.headerOption;
  }

  handleLogout = event => {
    signOutUser();
    sessionStorage.setItem('landlordObject', null);
    sessionStorage.setItem('userLoggedIn', null);
    this.userHasAuthenticated(false);
    ReactGA.event({
            category: 'Navigation',
            action: 'Logout',
        });
    this.props.history.push("/");
  }

  propertySearchClicked = event => {
    this.props.history.push("/property");
  }

  landingSearchClicked = event =>{
    if(this.landlordSearchCriteria == "Landlord Name" && this.state.landingSearchField){
      this.state.searchTableTitle = "Landlord Results";
      this.landlordSearchClicked();
    }else if(this.landlordSearchCriteria == "Address" && this.state.landingSearchField){
      this.state.searchTableTitle = "Property Results";
      this.landlordSearchAddressClicked();
    }
  }

  landlordSearchClicked = event => {
    this.landlords = [];
    this.landlordsDataSource = [];
    var landlordString = config.apis.LANDLORD_NAME_GET+this.state.landingSearchField;
    landlordString = encodeURI(landlordString);
    this.retrievelandlord(this,landlordString);
  }

  landlordSearchAddressClicked = event => {
    if(this.state.landingSearchField.includes(" ")){
      this.landlords = [];
      this.landlordsDataSource = [];
      var landlordString = config.apis.PROPERTY_ADDRESS_GET+this.state.landingSearchField;
      landlordString = encodeURI(landlordString);
      this.retrieveProperty(this,landlordString);
    } else {
      alert("Please enter more address information");
    }
  }
  
  retrievelandlord(self_this,landlordString){
        // test api
        var self = self_this;
        self.setLoadingIndicator(true);

          try{
           const GATEWAY_URL = [landlordString];

           fetch(GATEWAY_URL, {
               method: 'GET',
               mode: 'cors'
           })
               .then((response) => {
                   return response.json();
               })
               .then((json) => {
                   // this.setState({ accessToken: json.done.json.access_token });
                   // this.search();
                   if(json){
                    var jsonObj = json.resultlist;
                      if(json && jsonObj && jsonObj.length > 0) {
                        var maxCount = 0;
                        if(jsonObj.length > 25)
                        {
                          maxCount = 25;
                        } else {
                          maxCount = jsonObj.length;
                        }
                          for(var i=0; i<maxCount; i++){
                            var landlordObj = jsonObj[i];
                          var landlord = new LandlordModel;
                          landlord.fullName = landlordObj.L_Full_Name ? landlordObj.L_Full_Name : "";;
                          landlord.landlordId = landlordObj.L_ID ? landlordObj.L_ID : "";
                          
                          self.landlords.push(landlord);
                          var dsobj = {
                            "landlordName":landlord.fullName,
                            "index": i
                          };
                          self.landlordsDataSource.push(dsobj);
                        }
                            // show landlord class
                            // self.landlordResultsClass = ["landlord-result"];
                            self.setState({
                              landlordResultsClass: ["landlord-result"]
                            });
                            self.setLoadingIndicator(false);

                      } else {
                        self.setLoadingIndicator(false);
                        alert("No results found");
                      }
                   }
               })
               .catch((err) => {
                self.setLoadingIndicator(false);
                console.log('There was an error:' + err);alert("Landlord error");})
             } catch (e) {
              self.setLoadingIndicator(false);
                console.log('There was an error:'+e); 
                alert("Landlord error");
        }
  }

  retrieveProperty(self_this,landlordString){
    // test api
    var self = self_this;
    
    self.setLoadingIndicator(true);

      try{
       const GATEWAY_URL = [landlordString];

       fetch(GATEWAY_URL, {
           method: 'GET',
           mode: 'cors'
       }).then((response) => {
               return response.json();
           })
           .then((json) => {
               // this.setState({ accessToken: json.done.json.access_token });
               // this.search();
               if(json){
                 var jsonObj = json.resultlist;
                  if(json && jsonObj.length > 0) {
                      
                    var maxCount = 0;
                    if(jsonObj.length > 25)
                    {
                      maxCount = 25;
                    } else {
                      maxCount = jsonObj.length;
                    }
                      for(var i=0; i<maxCount; i++){
                        var propertyObj = jsonObj[i];
                      var property = new PropertyModel;
                      property.pAdd1 = propertyObj.P_Address_Line1 ? propertyObj.P_Address_Line1 : "";;
                      property.pid = propertyObj.P_ID ? propertyObj.P_ID : "";
                      
                      self.landlords.push(property);
                      var dsobj = {
                        "landlordName":property.pAdd1,
                        "index": i
                      };
                      self.landlordsDataSource.push(dsobj);
                    }
                        // show landlord class
                        // self.landlordResultsClass = ["landlord-result"];
                        self.setState({
                          landlordResultsClass: ["landlord-result"]
                        });
                        self.setLoadingIndicator(false);
                  } else {
                    self.setLoadingIndicator(false);
                    alert("No results found");
                  }
               }
           })
           .catch((err) => {
            self.setLoadingIndicator(false);
            console.log('There was an error:' + err);alert("Landlord error");})
         } catch (e) {
            console.log('There was an error:'+e); 
            self.setLoadingIndicator(false);
            alert("Landlord error");
    }
}

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handlePropertyKeyPress = (event) => {
    if(event.key == 'Enter' || event.key == 'Search'){
      this.propertySearchClicked();
    }
  }

  handleLandlordKeyPress = (event) => {
    if(event.key == 'Enter' || event.key == 'Search'){
      this.landlordSearchClicked();
    }
  }

  handleLandingKeyPress = (event) => {
    if(event.key == 'Enter' || event.key == 'Search'){
      this.landingSearchClicked();
    }
  }

  handleLandlordSearchKeyPress = (event) => {
    if(event.key == 'Enter' || event.key == 'Search'){
      this.landlordSearchAddressClicked();
    }
  }
  
  propertyLinkClicked = event => {
    this.landlordLink = ["nav-link"];
    this.propertyLink = ["nav-link active"];
    this.landlordTab = ["tab-pane"];
    this.propertyTab = ["tab-pane active show"];
  }

  landlordLinkClicked = event => {
    this.landlordLink = ["nav-link active"];
    this.propertyLink = ["nav-link"];
    this.landlordTab = ["tab-pane active show"];
    this.propertyTab = ["tab-pane"];
  }

  navigateToLandlordScreen = event => {
    ReactGA.event({
            category: 'Navigation',
            action: 'Landlord',
        });
    this.props.history.push("/landlord");
  }

  componentDidMount () {
      window.scrollTo(0, 0)
  }

  render() {
    
    return (
      this.showMe ? 
    <div>
      <div className={this.state.wrapperClass.join('' )}>
    <div class="headerpanel headerpanel-landing">
      <div class="container">
        <div class="headerpanel-left">
          <div class="logo"><i class="icon ion-ios-home"></i></div>
          <h4>rentvent</h4>
        </div>
        <a href="#" class="headerpanel-navicon" onClick={this.menuSelected.bind(this)}><i class="icon ion-navicon-round"></i></a>
        <div class="headerpanel-right d-none d-lg-block" className={this.headerpanelClass.join('' )}>
          <ul class="nav">
            <li class="nav-item"><a href="javascript:void(0)" class="nav-link active">Home</a></li>
            <li class="nav-item"><a href="#" class="nav-link ash" onClick={this.handleLogout}>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="landing-header">
      <div class="header-wrapper">
        <h3 class="header-headline landlord-header-section">Check any landlord's reputation and rental history.</h3>

        <div class="tab-content">
          <div id="findLandlord" class="tab-pane active show" className={this.landlordTab.join('' )}>


          <div class="row row-xs align-items-end">
              <div class="col-sm-9">
                <div class="row row-xs align-items-end">
                  <div class="col-5">
                    <div class="mg-b-5">Search by</div>
                    <Dropdown options={this.dropDownOptions} onChange={this.dropDownSelected} value={this.state.selectedDropDownOption} 
                    placeholder="Select an option" />
                  </div>
                  <div class="col-7">
                  <FormGroup controlId="landingSearchField" bsSize="large" className="landing-search-form-object">
                <FormControl
                  autoFocus
                  type="search"
                  value={this.state.landingSearchField}
                  onChange={this.handleChange}
                  placeholder="Search landlord"
                  onKeyPress={this.handleLandingKeyPress}
                />
                </FormGroup>
                  </div>
                </div>
              </div>
              <div class="col-sm-3 mg-t-15 mg-sm-t-0">
                <button class="btn btn-primary btn-block" disabled={!this.state.landingSearchField} onClick={this.landingSearchClicked}>Find Landlord</button>
              </div>
              
              <div className={this.state.landlordResultsClass.join('' )}>
                <BootstrapTable data={this.landlordsDataSource} striped hover options={ this.options } height='300' scrollTop={ 'Top' }>
                  <TableHeaderColumn isKey dataField='landlordName'>{this.state.searchTableTitle}</TableHeaderColumn>
              </BootstrapTable>
              </div>
            </div>
          </div>
          
          
          <div id="findProperty" class="tab-pane" className={this.propertyTab.join('' )}>
            <div class="row row-xs">
              <div class="col-md-9">
                <div class="row row-xs">
                  <div class="col-sm-7">
                    <FormGroup controlId="propertySearchField" bsSize="large">
                <FormControl
                  autoFocus
                  type="search"
                  value={this.state.propertySearchField}
                  onChange={this.handleChange}
                  placeholder="Enter keywords"
                  onKeyPress={this.handlePropertyKeyPress}
                />
                </FormGroup>
                  </div>
                  <div class="col-sm-5 mg-t-15 mg-sm-t-0">
                    <FormGroup controlId="propertySearchLocation" bsSize="large">
                <FormControl
                  autoFocus
                  type="search"
                  value={this.state.propertySearchLocation}
                  onChange={this.handleChange}
                  placeholder="Location"
                  onKeyPress={this.handlePropertyKeyPress}
                />
                </FormGroup>
                  </div>
                </div>
              </div>
              <div class="col-md-3 mg-t-15 mg-md-t-0">
                <button class="btn btn-primary btn-block" disabled={!this.state.propertySearchField && !this.state.propertySearchLocation} onClick={this.propertySearchClicked}>Find Property</button>
              </div>
            </div>
          </div>


        </div>

      </div>
    </div>
    <div class="bg-white pd-y-60 pd-sm-y-80">
      <div class="container">
        <h4 class="tx-sm-28 tx-center tx-gray-800 mg-b-60 mg-sm-b-80">Recent Reviews</h4>
        <div class="row">
          <div class="col-lg-6">
            <div class="card card-recent-review">
              <div class="card-body">
                <h5 class="recent-review-landlord"><a href="">Jennifer J. Ferrel</a></h5>
                <p class="recent-review-address"><a href="">3125 Henry Ford Avenue, Los Angeles, CA 74119 </a></p>
                <hr />
                <div class="row align-items-center">
                  <div class="col-sm">
                    <div class="landlord-star">
                      <div class="landlord-rating-star">
                        <i class="icon ion-star active"></i>
                        <i class="icon ion-star active"></i>
                        <i class="icon ion-star active"></i>
                        <i class="icon ion-star active"></i>
                        <i class="icon ion-star active"></i>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm mg-t-20 mg-sm-t-0">
                    <div class="d-flex align-items-center">
                      <div class="approve-landlord-donut">
                      <PieChart
                          size={50}
                          innerHoleSize={36}
                           data={[
                             { key: 'A', value: 81, color: '#2567C0' },
                             { key: 'C', value: 19, color: '#EAECEF' }
                            ]}/>
                        <div class="approve-landlord-percent">
                          <h6>81%</h6>
                        </div>
                      </div>
                      <p class="mg-b-0 mg-l-10">Recommend this landlord</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 mg-t-30 mg-lg-t-0">
            <div class="card card-recent-review">
              <div class="card-body">
                <h5 class="recent-review-landlord"><a href="">James C. Kelley</a></h5>
                <p class="recent-review-address"><a href="">4892 Lucky Duck Drive, Pittsburgh, PA 15222 </a></p>
                <hr />
                <div class="row align-items-center">
                  <div class="col-sm">
                    <div class="landlord-star">
                      <div class="landlord-rating-star">
                        <i class="icon ion-star active"></i>
                        <i class="icon ion-star active"></i>
                        <i class="icon ion-star active"></i>
                        <i class="icon ion-star active"></i>
                        <i class="icon ion-star"></i>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm mg-t-20 mg-sm-t-0">
                    <div class="d-flex align-items-center">
                      <div class="approve-landlord-donut">
                      <PieChart
                          size={50}
                          innerHoleSize={36}
                           data={[
                             { key: 'A', value: 89, color: '#2567C0' },
                             { key: 'C', value: 11, color: '#EAECEF' }
                            ]}/>
                        <div class="approve-landlord-percent">
                          <h6>89%</h6>
                        </div>
                      </div>
                      <p class="mg-b-0 mg-l-10">Recommend this landlord</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-6 mg-t-30">
            <div class="card card-recent-review">
              <div class="card-body">
                <h5 class="recent-review-landlord"><a href="">William D. Constantine</a></h5>
                <p class="recent-review-address"><a href="">4892 Lucky Duck Drive, Pittsburgh, PA 15222 </a></p>
                <hr />
                <div class="row align-items-center">
                  <div class="col-sm">
                    <div class="landlord-star">
                      <div class="landlord-rating-star">
                        <i class="icon ion-star active"></i>
                        <i class="icon ion-star active"></i>
                        <i class="icon ion-star active"></i>
                        <i class="icon ion-star active"></i>
                        <i class="icon ion-star"></i>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm mg-t-20 mg-sm-t-0">
                    <div class="d-flex align-items-center">
                      <div class="approve-landlord-donut">
                      <PieChart
                          size={50}
                          innerHoleSize={36}
                           data={[
                             { key: 'A', value: 83, color: '#2567C0' },
                             { key: 'C', value: 17, color: '#EAECEF' }
                            ]}/>
                        <div class="approve-landlord-percent">
                          <h6>83%</h6>
                        </div>
                      </div>
                      <p class="mg-b-0 mg-l-10">Recommend this landlord</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-6 mg-t-30">
            <div class="card card-recent-review">
              <div class="card-body">
                <h5 class="recent-review-landlord"><a href="">Daniel D. Jones</a></h5>
                <p class="recent-review-address"><a href="">4730 Hiney Road, North Las Vegas, NV 89032</a></p>
                <hr />
                <div class="row align-items-center">
                  <div class="col-sm">
                    <div class="landlord-star">
                      <div class="landlord-rating-star">
                        <i class="icon ion-star active"></i>
                        <i class="icon ion-star active"></i>
                        <i class="icon ion-star active"></i>
                        <i class="icon ion-star active"></i>
                        <i class="icon ion-star active"></i>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm mg-t-20 mg-sm-t-0">
                    <div class="d-flex align-items-center">
                      <div class="approve-landlord-donut">
                      <PieChart
                          size={50}
                          innerHoleSize={36}
                           data={[
                             { key: 'A', value: 90, color: '#2567C0' },
                             { key: 'C', value: 10, color: '#EAECEF' }
                            ]}/>
                        <div class="approve-landlord-percent">
                          <h6>90%</h6>
                        </div>
                      </div>
                      <p class="mg-b-0 mg-l-10">Recommend this landlord</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-gray-100 pd-y-60 pd-sm-y-80">
      <div class="container">
        <h4 class="tx-sm-28 tx-center tx-gray-800 mg-b-60 mg-sm-b-80">Browse Property by Location</h4>
        <div class="row">
          <div class="col-sm-6 col-lg-4">
            <div class="card card-landlord-fold">
              <figure>
                <img src={this.santaMonicaImage} class="img-fit-cover" alt="" />
                <figcaption>
                  <h2>Santa Monica</h2>
                </figcaption>
              </figure>
              <div class="card-body">
                <a href="" class="btn btn-outline-primary pd-x-25">View City <i class="fa fa-angle-right mg-l-5"></i></a>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-lg-4 mg-t-30 mg-sm-t-0">
            <div class="card card-landlord-fold">
              <figure>
                <img src={this.westHollywoodImage} class="img-fit-cover" alt="" />
                <figcaption>
                  <h2>West Hollywood</h2>
                </figcaption>
              </figure>
              <div class="card-body">
                <a href="" class="btn btn-outline-primary pd-x-25">View City <i class="fa fa-angle-right mg-l-5"></i></a>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-lg-4 mg-t-30 mg-lg-t-0">
            <div class="card card-landlord-fold">
              <figure>
                <img src={this.pasadenaImage} class="img-fit-cover" alt="" />
                <figcaption>
                  <h2>Pasadena</h2>
                </figcaption>
              </figure>
              <div class="card-body">
                <a href="" class="btn btn-outline-primary pd-x-25">View City <i class="fa fa-angle-right mg-l-5"></i></a>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-lg-4 mg-t-30">
            <div class="card card-landlord-fold">
              <figure>
                <img src={this.beverlyHillsImage} class="img-fit-cover" alt="" />
                <figcaption>
                  <h2>Beverly Hills</h2>
                </figcaption>
              </figure>
              <div class="card-body">
                <a href="" class="btn btn-outline-primary pd-x-25">View City <i class="fa fa-angle-right mg-l-5"></i></a>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-lg-4 mg-t-30">
            <div class="card card-landlord-fold">
              <figure>
                <img src={this.manhattanImage} class="img-fit-cover" alt="" />
                <figcaption>
                  <h2>Manhattan Beach</h2>
                </figcaption>
              </figure>
              <div class="card-body">
                <a href="" class="btn btn-outline-primary pd-x-25">View City <i class="fa fa-angle-right mg-l-5"></i></a>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-lg-4 mg-t-30">
            <div class="card card-landlord-fold">
              <figure>
                <img src={this.longBeachImage} class="img-fit-cover" alt="" />
                <figcaption>
                  <h2>Long Beach</h2>
                </figcaption>
              </figure>
              <div class="card-body">
                <a href="" class="btn btn-outline-primary pd-x-25">View City <i class="fa fa-angle-right mg-l-5"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    
      </div>
      <div className="overlay-indicator">
      <div className="loading-indicator">
          <ScaleLoader
          color={'#8E54E9'} 
          loading={this.state.loading}
           />
          </div>
      </div>
    </div>
    : null
    );
  }
}
