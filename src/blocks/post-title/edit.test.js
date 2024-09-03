import React from 'react';
import { render } from '@testing-library/react';

/**
 * WordPress dependencies.
 */
import { RichText } from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { PostTypeSupportCheck } from '@wordpress/editor';

/**
 * Internal dependencies.
 */
import Edit from './edit';

// Mocks for WordPress dependencies
jest.mock('@wordpress/block-editor', () => ({
  useBlockProps: jest.fn().mockReturnValue({}),
  RichText: jest.fn((props) => <div {...props} />),
}));

jest.mock('@wordpress/data', () => ({
  useSelect: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('@wordpress/editor', () => ({
  PostTypeSupportCheck: jest.fn((props) => <div {...props} />),
}));

jest.mock('@wordpress/i18n', () => ({
  __: jest.fn((str) => str),
}));

describe('Edit component', () => {
  beforeEach(() => {
    // Mock implementation for useSelect
    useSelect.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(() => ({
          getEditedPostAttribute: (attr) => (attr === 'slug' ? 'test-slug' : 'Test Title'),
        }));
      }
    });

    // Mock implementation for useDispatch
    useDispatch.mockReturnValue({
      editPost: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<Edit />);

    // Check if PostTypeSupportCheck is rendered
    expect(PostTypeSupportCheck).toHaveBeenCalledWith(
      expect.objectContaining({ supportKeys: 'title' }),
      {}
    );

    // Check if RichText is rendered with the correct props
    expect(RichText).toHaveBeenCalledWith(
      expect.objectContaining({
        allowedFormats: [
          'core/bold',
          'core/italic',
          'core/strikethrough',
          'core/underline',
          'wpcom/underline',
        ],
        className:
          'wp-block-post-title editor-post-title editor-post-title__input',
        placeholder: 'Write Headline',
        tagName: 'h1',
        value: 'Test Title',
      }),
      {}
    );
  });

  it('should remove the core title on mount', () => {
    document.body.innerHTML =
      '<div class="edit-post-visual-editor__post-title-wrapper"></div>';

    render(<Edit />);

    // Check if the element was removed
    expect(
      document.querySelector('.edit-post-visual-editor__post-title-wrapper')
    ).toBeNull();
  });
});
