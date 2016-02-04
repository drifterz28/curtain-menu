'use strict';
var React = require('react');
var events = require('./events');
var Curtain = require('./curtain-nav.jsx');

var Header = React.createClass({
	componentDidMount: function() {
		events.setup();
	},
	openMenu: function(e) {
		events.hamburger(e);
	},
	render: function() {
		return (
			<header>
				{this.props.title}
				<button className="hamburger" onClick={this.openMenu}>
					<span>Menu</span>
				</button>
			</header>
		);
	}
});

var Contents = React.createClass({
	render: function() {
		return (
			<div className="container">
				{this.props.contents}
			</div>
		);
	}
});

module.exports = React.createClass({
	componentWillReceiveProps: function(nextProps) {
		console.log('nextProps ', nextProps);
	},
	render: function() {
		console.log(this.props);
		return (
			<div>
				<Header title={this.props.SiteName}/>
				<Contents />
				<Curtain menu={this.props.menu}/>
			</div>
		);
	}
});
