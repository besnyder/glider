import React from 'react'
import { connect } from 'react-redux'
import { Button, Dialog, Intent, Menu, MenuItem } from '@blueprintjs/core'
import { Suggest } from '@blueprintjs/select'
import { fetchTagData, closeDialog } from '../actionCreators'
import { getActiveDialogType } from '../selectors'
import * as dialogTypes from '../constants/dialogTypes'

class LoadTagsDialog extends React.Component {
	state = { items: [], selected: null }

	componentDidMount() {
		fetch('/api/tags-metadata')
			.then(response => response.json())
			.then(items => {
				items.forEach(item => (item.text = item.tag + ' (' + item.user + ')'))
				this.setState({ items })
			})
	}

	handleClick = () => {
		const { tag, user } = this.state.selected
		this.props.fetchTagData(tag, user)
	}

	renderSuggest = () => (
		<Suggest
			items={this.state.items}
			itemPredicate={(query, item) => item.text.startsWith(query)}
			itemListRenderer={({ items, itemsParentRef, query, renderItem }) => {
				const renderedItems = items.map(renderItem).filter(item => item != null)
				if (renderedItems.length === 0)
					renderedItems.push(<MenuItem disabled={true} text="No results." />)
				return (
					<div style={{ maxHeight: 300, overflow: 'auto' }}>
						<Menu ulRef={itemsParentRef}>{renderedItems}</Menu>
					</div>
				)
			}}
			itemRenderer={(item, { modifiers, handleClick }) =>
				modifiers.matchesPredicate ? (
					<MenuItem
						key={item.text}
						text={item.text}
						label={item.num}
						onClick={handleClick}
					/>
				) : null
			}
			noResults={<MenuItem disabled={true} text="No results." />}
			inputValueRenderer={item => item.text}
			onItemSelect={item => this.setState({ selected: item })}
			popoverProps={{ minimal: true, usePortal: false }}
		>
			<Button text="Select" rightIcon="caret-down" />
		</Suggest>
	)

	render = () => (
		<Dialog
			icon="document-open"
			title="Load Tag"
			isOpen={this.props.isOpen}
			onClose={this.props.closeDialog}
		>
			<div className="pt-dialog-body" style={{ textAlign: 'center' }}>
				{this.renderSuggest()}
				<Button
					text="Load"
					intent={Intent.PRIMARY}
					disabled={this.state.selected === null}
					onClick={this.handleClick}
				/>
			</div>
		</Dialog>
	)
}

const mapStateToProps = state => ({
	isOpen: getActiveDialogType(state) === dialogTypes.LOAD_TAGS,
})

const mapDispatchToProps = dispatch => ({
	fetchTagData: (tag, user) => dispatch(fetchTagData(tag, user)),
	closeDialog: () => dispatch(closeDialog(dialogTypes.LOAD_TAGS)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LoadTagsDialog)
