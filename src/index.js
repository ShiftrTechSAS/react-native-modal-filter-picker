/* eslint import/extensions:0 */
/* eslint import/no-unresolved:0 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Modal,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native'

import styles from './styles'

export default class ModalFilterPicker extends Component {
  static keyExtractor(item) {
    return item.key.toString()
  }

  constructor(props, ctx) {
    super(props, ctx)

    this.state = {
      filter: '',
      ds: props.options
    }
  }

  componentWillReceiveProps(newProps) {
    if (
      (!this.props.visible && newProps.visible) ||
      this.props.options !== newProps.options
    ) {
      this.setState({
        filter: '',
        ds: newProps.options
      })
    }
  }

  render() {
    const {
      title,
      multiple,
      titleTextStyle,
      overlayStyle,
      actionsContainerStyle,
      renderList,
      renderCancelButton,
      renderConfirmButton,
      modal,
      visible,
      onCancel
    } = this.props

    const renderedTitle = !title ? null : (
      <Text style={titleTextStyle || styles.titleTextStyle}>{title}</Text>
    )

    return (
      <Modal
        onRequestClose={onCancel}
        {...modal}
        visible={visible}
        supportedOrientations={['portrait', 'landscape']}
      >
        <KeyboardAvoidingView
          behavior='padding'
          style={overlayStyle || styles.overlay}
          enabled={Platform.OS === 'ios'}
        >
          <SafeAreaView style={{ flex: 0 }}>
            <View>{renderedTitle}</View>
            {(renderList || this.renderList)()}
            <View style={actionsContainerStyle || styles.actionsContainer}>
              {(renderCancelButton || this.renderCancelButton)()}
              {multiple && (renderConfirmButton || this.renderConfirmButton)()}
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    )
  }

  renderList = () => {
    const {
      showFilter,
      autoFocus,
      listContainerStyle,
      androidUnderlineColor,
      placeholderText,
      placeholderTextColor,
      filterTextInputContainerStyle,
      filterTextInputStyle
    } = this.props

    const filter = !showFilter ? null : (
      <View
        style={filterTextInputContainerStyle || styles.filterTextInputContainer}
      >
        <TextInput
          value={this.state.filter}
          onChangeText={this.onFilterChange}
          autoCorrect={false}
          blurOnSubmit={true}
          autoFocus={autoFocus}
          autoCapitalize='none'
          underlineColorAndroid={androidUnderlineColor}
          placeholderTextColor={placeholderTextColor}
          placeholder={placeholderText}
          style={filterTextInputStyle || styles.filterTextInput}
        />
      </View>
    )

    return (
      <View style={listContainerStyle || styles.listContainer}>
        {filter}
        {this.renderOptionList()}
      </View>
    )
  }

  renderOptionList = () => {
    const {
      noResultsText,
      flatListViewProps,
      keyExtractor,
      keyboardShouldPersistTaps,
      noResultsTextStyle
    } = this.props

    const { ds } = this.state

    if (!ds.length) {
      return (
        <FlatList
          data={ds}
          keyExtractor={keyExtractor || this.constructor.keyExtractor}
          {...flatListViewProps}
          ListEmptyComponent={() => (
            <View style={styles.noResults}>
              <Text style={noResultsTextStyle || styles.noResultsText}>{noResultsText}</Text>
            </View>
          )}
        />
      )
    }
    return (
      <FlatList
        keyExtractor={keyExtractor || this.constructor.keyExtractor}
        {...flatListViewProps}
        data={ds}
        renderItem={this.renderOption}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      />
    )
  }

  renderOption = ({ item }) => {
    const {
      multiple,
      selectedOption,
      selectedOptions,
      renderOption,
      optionTextStyle,
      selectedOptionTextStyle
    } = this.props

    const { key, label } = item

    let style = styles.optionStyle
    let textStyle = optionTextStyle || styles.optionTextStyle

    if (multiple) {
      if (selectedOptions.includes(key)) {
        style = styles.selectedOptionStyle
        textStyle = selectedOptionTextStyle || styles.selectedOptionTextStyle
      }
    } else if (key === selectedOption) {
      style = styles.selectedOptionStyle
      textStyle = selectedOptionTextStyle || styles.selectedOptionTextStyle
    }

    if (renderOption) {
      if (multiple) {
        return renderOption(item, selectedOptions.includes(key))
      }
      return renderOption(item, key === selectedOption)
    }
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={style}
        onPress={() => this.props.onSelect(item)}
      >
        <Text style={textStyle}>{label}</Text>
      </TouchableOpacity>
    )
  }

  renderCancelButton = () => {
    const {
      cancelButtonStyle,
      cancelButtonTextStyle,
      cancelButtonText
    } = this.props

    return (
      <TouchableOpacity
        onPress={this.props.onCancel}
        activeOpacity={0.7}
        style={cancelButtonStyle || styles.cancelButton}
      >
        <Text style={cancelButtonTextStyle || styles.cancelButtonText}>
          {cancelButtonText}
        </Text>
      </TouchableOpacity>
    )
  }

  renderConfirmButton = () => {
    const {
      confirmButtonStyle,
      confirmButtonTextStyle,
      confirmButtonText
    } = this.props

    return (
      <TouchableOpacity
        onPress={this.props.onConfirm}
        activeOpacity={0.7}
        style={confirmButtonStyle || styles.cancelButton}
      >
        <Text style={confirmButtonTextStyle || styles.cancelButtonText}>
          {confirmButtonText}
        </Text>
      </TouchableOpacity>
    )
  }

  onFilterChange = (text) => {
    const { options } = this.props

    const filter = text.toLowerCase()

    // apply filter to incoming data
    const filtered = !filter.length
      ? options
      : options.filter(
          ({ searchKey, label }) =>
            label.toLowerCase().indexOf(filter) >= 0 ||
            (searchKey && searchKey.toLowerCase().indexOf(filter) >= 0)
        )
    /* eslint react/no-unused-state:0 */
    this.setState({
      filter: text.toLowerCase(),
      ds: filtered
    })
  }
}

/* eslint react/forbid-prop-types:0 */

ModalFilterPicker.propTypes = {
  options: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  placeholderText: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  androidUnderlineColor: PropTypes.string,
  cancelButtonText: PropTypes.string,
  confirmButtonText: PropTypes.string,
  title: PropTypes.string,
  noResultsText: PropTypes.string,
  visible: PropTypes.bool,
  multiple: PropTypes.bool,
  showFilter: PropTypes.bool,
  modal: PropTypes.object,
  selectedOption: PropTypes.string,
  selectedOptions: PropTypes.array,
  renderOption: PropTypes.func,
  renderCancelButton: PropTypes.func,
  renderConfirmButton: PropTypes.func,
  renderList: PropTypes.func,
  flatListViewProps: PropTypes.object,
  filterTextInputContainerStyle: PropTypes.any,
  filterTextInputStyle: PropTypes.any,
  actionsContainerStyle: PropTypes.any,
  cancelButtonStyle: PropTypes.any,
  cancelButtonTextStyle: PropTypes.any,
  confirmButtonStyle: PropTypes.any,
  confirmButtonTextStyle: PropTypes.any,
  titleTextStyle: PropTypes.any,
  overlayStyle: PropTypes.any,
  listContainerStyle: PropTypes.any,
  optionTextStyle:PropTypes.any,
  selectedOptionTextStyle:PropTypes.any,
  noResultsTextStyle:PropTypes.any,
  keyExtractor: PropTypes.any,
  autoFocus: PropTypes.any,
  keyboardShouldPersistTaps: PropTypes.string
}

ModalFilterPicker.defaultProps = {
  placeholderText: 'Filter...',
  placeholderTextColor: '#ccc',
  androidUnderlineColor: 'rgba(0,0,0,0)',
  cancelButtonText: 'Cancel',
  noResultsText: 'No matches',
  visible: true,
  multiple: false,
  showFilter: true,
  keyboardShouldPersistTaps: 'always',
  selectedOptions: [],
  onConfirm: () => {},
  confirmButtonText: 'Confirm'
}
