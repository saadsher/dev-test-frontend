import React, { Component } from 'react';
import Griddle from 'griddle-react';
const bikeJSON = "http://jujhar.com/bikes.json";
// const sortOrder = false;
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './App.css';

var ImgRender = React.createClass({
  getDefaultProps: function() {
    return { "data": {} }
  },

  render: function(){
    return (
      <a href={this.props.rowData.image.large}>
        <img className="img-responsive" src={this.props.data} alt="bike" />
      </a>
    )
  }
})

var ClassRender = React.createClass({
  getDefaultProps: function() {
    return { "data": {} }
  },

  render: function(){
    return (
      <ul className="list-unstyled list-parent">
        <li className="list-child">{this.props.data[0]}</li>
        <li className="list-child">{this.props.data[1]}</li>
        <li className="list-child">{this.props.data[2]}</li>
      </ul>
    )
  }
})

var HeaderComponent = React.createClass({
  textOnClick: function(e) {
    e.stopPropagation();
  },

  filterText: function(e) {
    this.props.filterByColumn(e.target.value, this.props.columnName)
  },

  render: function(){
    return (
      <span>
        <input type='text' onChange={this.filterText} onClick={this.textOnClick} />
        <div>{this.props.displayName}</div>
      </span>
    )
  }
})

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      requestFailed: false
    }
  }

  componentDidMount() {
    fetch(bikeJSON)
      .then(response => {
        if (!response.ok) {
          throw Error("Network request failed")
        }
        return response
      })
      .then(d => d.json())
      .then(d => {
        this.setState({
          bikeData: d
        })
      }, () => {
        this.setState({
          requestFailed: true
        })
      })
  }

  render() {
    if (this.state.requestFailed) return <p>...failed to load</p>
    if (!this.state.bikeData) return <p>...loading</p>

    return (
      <div className="App container">
        <div className="App-header">
          <h2>A sortable list of bikes using React</h2>
        </div>
        <Griddle
          paddingHeight="15"
          results={this.state.bikeData.items}
          tableClassName="table"
          filterPlaceholderText="Filter by class for eg. endurance"
          columnMetadata={[
            {
              "columnName": "name",
              "displayName": "Name"
            },
            {
              "columnName": "image.thumb",
              "displayName": "Image",
              "customComponent": ImgRender
            },
            {
              "columnName": "description",
              "displayName": "Description"
            },
            {
              "columnName": "class",
              "displayName": "Class",
              "customComponent": ClassRender,
              "customHeaderComponent": HeaderComponent
            }
          ]}
          columns={["name", "image.thumb", "description", "class"]}/>
      </div>
    );
  }
}

export default App;
