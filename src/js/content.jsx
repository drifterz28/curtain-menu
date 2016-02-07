'use strict';
var React = require('react');

module.exports = React.createClass({
	render: function() {
		console.log(this.props.entries);
		return (
			<div className="container">
				<ul>
				{this.props.entries.map(function(newsEntry, i) {
					return (
						<li key={i}>
							<a href={newsEntry.link} target="_blank">
								{newsEntry.title}
							</a>
							{newsEntry.contentSnippet}
						</li>
					);
				}.bind(this))}
				</ul>
			</div>
		);
	}
});

/*
contentSnippet: "... future is always within sight, and you don&#39;t need to imagine what&#39;s already <br>↵there. Case in point: The buzz surrounding the <b>Internet of Things</b>. What&#39;s the buzz<br>↵?"
link: "http://www.wired.com/insights/2014/11/the-internet-of-things-bigger/"
title: "The <b>Internet of Things</b> Is Far Bigger Than Anyone Realizes | WIRED"
url: "http://www.wired.com/feed/"
*/
