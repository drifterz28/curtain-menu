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
		console.log('nextProps sub ', nextProps);
		events.subNavControl();
		this.setState({
			menuItem: nextProps.menuItem
		});
	},
	render: function() {
		console.log('this state ', this.state.menuItem);
		return (
			<div className="subNav">
				<div className="slideControl">
					<i className="fa fa-bars fa-rotate-90"></i>
				</div>
				<div className="subHeader">
					<span className="subHeaderTitle">{this.state.menuItem.title}</span>
				</div>
				<ul className="subNavLinks">
					{this.state.menuItem.subCat.map(function(subItem, i) {
						return (
							<li key={i}>
								<a href="#" className="subnavLink" data-key={i} onClick={this.props.onClick}>
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
								<a href="#" className="subnavLink" data-key={i} onClick={this.props.onClick}>
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
	subNav: function(e) {
		e.preventDefault();
		var target = e.currentTarget;
		var index = target.getAttribute('data-key');
		var menuItem = this.props.menu[index];
		if(menuItem.subCat.length > 0) {
			this.setState({
				menuItem: menuItem
			});
		} else {
			console.log('noting to show');
			// fire some function to make this the content filler
		}
		target.classList.add('active');
	},
	render: function() {
		return (
			<div>
				<Menu menu={this.props.menu} onClick={this.subNav}/>
				<SubMenu menuItem={this.state.menuItem}/>
			</div>
		);
	}
});
/*
<div class="navMenu">
	<ul class="mainNav">
		<li>
			<a href="#" class="subnavLink">
				<i class="fa fa-bluetooth-b"></i>
				Technology
			</a>
		</li>
	</ul>
</div>
<div class="subNav">
	<div class="slideControl">
		<i class="fa fa-bars fa-rotate-90"></i>
	</div>
	<div class="subHeader">
		<span class="subHeaderTitle"></span>
	</div>
</div>
*/
