'use strict';
var React = require('react');

var SubMenu = React.createClass({
	render: function() {
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
		console.log(this.props.menu);
		return (
			<div className="navMenu">
				<ul className="mainNav">
					{this.props.menu.map(function(menuItem, i) {
						return (
							<li key={i}>
								<a href="#" className="subnavLink" data-key={i}>
									<i className={'fa fa-' + menuItem.icon}></i>
									{menuItem.title}
								</a>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
});

module.exports = React.createClass({
	componentWillReceiveProps: function(nextProps) {
		console.log('nextProps ', nextProps);
	},
	render: function() {
		return (
			<div>
				<Menu menu={this.props.menu}/>
				<SubMenu />
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
