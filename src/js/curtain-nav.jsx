/* globals google */
'use strict';
var React = require('react');
var events = require('./events');

var SubMenu = React.createClass({
	getInitialState: function() {
		return {
			menuItem: {
				subCat: []
			}
		};
	},
	componentDidMount: function() {
		events.setup();
	},
	componentWillReceiveProps: function(nextProps) {
		events.subNavControl();
		this.setState({
			menuItem: nextProps.menuItem
		});
	},
	linkClick: function(e) {
		e.preventDefault();
		var target = e.currentTarget;
		var keywords = target.textContent;

		events.closeMenu(e);
		var feed = new google.feeds.findFeeds(keywords, function(result) {
			console.log(result);
			if (!result.error) {
				this.props.updateContent(result.entries);
			}
		}.bind(this));
		console.log(keywords + ' link click');
	},
	render: function() {
		return (
			<div className="subNav">
				<div className="slideControl">
					<i className="fa fa-bars fa-rotate-90"></i>
				</div>
				<div className="subHeader">
					<span className="subHeaderTitle">{this.state.menuItem.title}</span>
				</div>
				<ul className="subMenuLinks">
					{this.state.menuItem.subCat.map(function(subItem, i) {
						return (
							<li key={i}>
								<a href="#" className="links" data-key={i} onClick={this.linkClick}>
									<i className={'fa fa-' + subItem.icon}></i>
									{subItem.title}
								</a>
							</li>
						);
					}.bind(this))}
				</ul>
			</div>
		);
	}
});

var Menu = React.createClass({
	render: function() {
		return (
			<div className="navMenu">
				<ul className="mainNav">
					{this.props.menu.map(function(menuItem, i) {
						return (
							<li key={i}>
								<a href="#" className="subNavLink" data-key={i} onClick={this.props.onClick}>
									<i className={'fa fa-' + menuItem.icon}></i>
									{menuItem.title}
								</a>
							</li>
						);
					}.bind(this))}
				</ul>
			</div>
		);
	}
});

module.exports = React.createClass({
	getInitialState: function() {
		return {
			menuItem: {}
		};
	},
	updateContent: function(entries) {
		this.props.updateContent(entries);
	},
	subNav: function(e) {
		e.preventDefault();
		var target = e.currentTarget;
		var index = target.getAttribute('data-key');
		var keywords = target.textContent;
		var menuItem = this.props.menu[index];
		if(menuItem.subCat.length > 0) {
			this.setState({
				menuItem: menuItem
			});
		} else {
			// fire some function to make this the content filler
			events.closeMenu(e);
			var feed = new google.feeds.findFeeds(keywords, function(result) {
				console.log(result);
				if (!result.error) {
					this.updateContent(result.entries);
				}
			}.bind(this));
		}
		events.setActive(target);
	},
	render: function() {
		return (
			<div>
				<Menu menu={this.props.menu} onClick={this.subNav}/>
				<SubMenu updateContent={this.updateContent} menuItem={this.state.menuItem}/>
			</div>
		);
	}
});
