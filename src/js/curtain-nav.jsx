'use strict';
var React = require('react');

var SubMenu = React.createClass({
	componentWillReceiveProps: function(nextProps) {
		console.log('nextProps sub ', nextProps);
	},
	render: function() {
		console.log(this.props);
		return (
			<div className="subNav">
				<div className="slideControl">
					<i className="fa fa-bars fa-rotate-90"></i>
				</div>
				<div className="subHeader">
					<span className="subHeaderTitle"></span>
				</div>
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
			subMenu: []
		};
	},
	componentWillReceiveProps: function(nextProps) {
		console.log('nextProps ', nextProps);
	},
	subNav: function(e) {
		e.preventDefault();
		var target = e.currentTarget;
		var index = target.getAttribute('data-key');
		var subCat = this.props.menu[index].subCat;
		if(subCat.length > 0) {
			this.setState({
				subMenu: subCat
			});
		} else {
			// fire some function to make this the content filler
		}
	},
	render: function() {
		return (
			<div>
				<Menu menu={this.props.menu} onClick={this.subNav}/>
				<SubMenu subMenu={this.state.subMenu}/>
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
