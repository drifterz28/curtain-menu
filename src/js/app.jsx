'use strict';
var React = require('react');
var events = require('./events');
var Curtain = require('./curtain-nav.jsx');
var Content = require('./content.jsx');

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

module.exports = React.createClass({
	getInitialState: function() {
		return {
			entries: []
		};
	},
	updateContent: function(entries) {
		console.log(entries);
		this.setState({entries: entries});
	},
	render: function() {
		return (
			<div>
				<Header title={this.props.SiteName}/>
				<Content entries={this.state.entries}/>
				<Curtain updateContent={this.updateContent} menu={this.props.menu}/>
			</div>
		);
	}
});
