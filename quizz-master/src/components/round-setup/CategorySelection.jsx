import React from "react";
import * as ReactRedux from "react-redux";
import {
	setSelectedCategoriesAction,
	setSelectedQuestionsAction
} from "../../actions/quiz-actions";
class CategorySelectionUI extends React.Component {
	constructor() {
		super();
		this.state = {
			max_selections: 3,
			last_valid_selection: null,
			selection: []
		};
	}
	componentDidMount() {
		// Default select first 3 categories
		const initialSelection = this.props.categories.slice(
			0,
			this.state.max_selections
		);
		this.setState({
			selection: initialSelection,
			last_valid_selection: initialSelection
		});
		this.props.doSetSelectedCategories(initialSelection);
		this.props.doSetSelectedQuestions(
			filterQuestionsByCategories(this.props.questions, initialSelection).slice(
				0,
				12
			)
		);
	}
	render() {
		return (
			<div>
				<select
					className="custom-select"
					size="12"
					multiple
					value={this.state.selection}
					onChange={async event => {
						var values = [...event.target.options]
							.filter(o => o.selected)
							.map(o => o.value);
						if (values.length > this.state.max_selections) {
							this.setState((state, props) => {
								return { selection: state.last_valid_selection };
							});
							this.props.doSetSelectedQuestions(
								filterQuestionsByCategories(this.props.questions, values)
							);
							this.props.doSetSelectedCategories(
								this.state.last_valid_selection
							);
						} else {
							this.setState({
								selection: values,
								last_valid_selection: values
							});
							this.props.doSetSelectedCategories(values);
							this.props.doSetSelectedQuestions(
								filterQuestionsByCategories(this.props.questions, values).slice(
									0,
									12
								)
							);
						}
					}}
				>
					{this.props.categories.map(category => (
						<option key={category} value={category}>
							{category}
						</option>
					))}
				</select>
			</div>
		);
	}
}

function filterQuestionsByCategories(questions, categories) {
	return questions.filter(q => {
		if (categories) {
			return categories.includes(q.category);
		}
		return false;
	});
}

function mapStateToProps(state) {
	return {
		questions: state.quiz.questions,
		categories: state.quiz.questions
			.map(q => q.category)
			.filter((value, index, self) => {
				return self.indexOf(value) === index;
			}),
		selectedCategories: state.quiz.selectedCategories
	};
}

function mapDispatchToProps(dispatch) {
	return {
		doSetSelectedQuestions: questions =>
			dispatch(setSelectedQuestionsAction(questions)),
		doSetSelectedCategories: categories =>
			dispatch(setSelectedCategoriesAction(categories))
	};
}

export const CategorySelection = ReactRedux.connect(
	mapStateToProps,
	mapDispatchToProps
)(CategorySelectionUI);
