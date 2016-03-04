'use strict';
var createAvaRule = require('../create-ava-rule');

module.exports = function (context) {
	var ava = createAvaRule();
	var segmentInfoMap = Object.create(null);
	var segmentStack = [];

	function currentSegment() {
		return segmentStack[segmentStack.length - 1];
	}

	function currentSegmentInfo() {
		return segmentInfo(currentSegment());
	}

	function segmentInfo(segment) {
		return segmentInfoMap[segment.id];
	}

	function segmentStart(segment) {
		segmentStack.push(segment);
		segmentInfoMap[segment.id] = {
			segment: segment,
			endExpression: null,
			reported: false
		};
	}

	function segmentEnd() {
		segmentStack.pop();
	}

	function callExpression(node) {
		if (isEndExpression(node)) {
			currentSegmentInfo().endExpression = node;
		}
	}

	function gatherUnreported(segment) {
		var unreported = [];

		function add(segment) {
			if (isUnreported(segment)) {
				unreported.push(segmentInfo(segment));
			}
		}
		add(segment);

		segment.prevSegments.forEach(add);

		return unreported;
	}

	function isUnreported(segment) {
		var info = segmentInfo(segment);
		return !(!info.endExpression || info.reported);
	}

	function statement(node) {
		if (!ava.isTestFile) {
			return;
		}
		var unreported = gatherUnreported(currentSegment());

		if (unreported.length) {
			unreported.forEach(function (info) {
				info.reported = true;
			});
			context.report(node, 'No statements following a call to t.end().');
		}
	}

	return ava.merge({
		ExpressionStatement: statement,
		ReturnStatement: function (node) {
			if (node.argument) {
				statement(node);
			}
		},
		WithStatement: statement,
		IfStatement: statement,
		SwitchStatement: statement,
		ThrowStatement: statement,
		TryStatement: statement,
		WhileStatement: statement,
		DoWhileStatement: statement,
		ForStatement: statement,
		ForInStatement: statement,
		ForOfStatement: statement,

		onCodePathSegmentStart: segmentStart,
		onCodePathSegmentEnd: segmentEnd,

		CallExpression: callExpression
	});
};

function isEndExpression(node) {
	return (
		node.type === 'CallExpression' &&
		node.callee.type === 'MemberExpression' &&
		node.callee.object.type === 'Identifier' &&
		node.callee.object.name === 't' &&
		node.callee.property.type === 'Identifier' &&
		node.callee.property.name === 'end'
	);
}
