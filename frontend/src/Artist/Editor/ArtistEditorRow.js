import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import titleCase from 'Utilities/String/titleCase';
import TagListConnector from 'Components/TagListConnector';
import CheckInput from 'Components/Form/CheckInput';
import TableRow from 'Components/Table/TableRow';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableSelectCell from 'Components/Table/Cells/TableSelectCell';
import ArtistNameLink from 'Artist/ArtistNameLink';
import ArtistStatusCell from 'Artist/Index/Table/ArtistStatusCell';
import styles from './ArtistEditorRow.css';

class ArtistEditorRow extends Component {

  //
  // Listeners

  onSeasonFolderChange = () => {
    // Mock handler to satisfy `onChange` being required for `CheckInput`.
    //
  }

  //
  // Render

  render() {
    const {
      id,
      status,
      nameSlug,
      artistName,
      monitored,
      languageProfile,
      qualityProfile,
      albumFolder,
      path,
      tags,
      columns,
      isSelected,
      onSelectedChange
    } = this.props;

    return (
      <TableRow>
        <TableSelectCell
          id={id}
          isSelected={isSelected}
          onSelectedChange={onSelectedChange}
        />

        <ArtistStatusCell
          monitored={monitored}
          status={status}
        />

        <TableRowCell className={styles.title}>
          <ArtistNameLink
            nameSlug={nameSlug}
            artistName={artistName}
          />
        </TableRowCell>

        <TableRowCell>
          {qualityProfile.name}
        </TableRowCell>

        {
          _.find(columns, { name: 'languageProfileId' }).isVisible &&
            <TableRowCell>
              {languageProfile.name}
            </TableRowCell>
        }

        <TableRowCell className={styles.albumFolder}>
          <CheckInput
            name="albumFolder"
            value={albumFolder}
            isDisabled={true}
            onChange={this.onSeasonFolderChange}
          />
        </TableRowCell>

        <TableRowCell>
          {path}
        </TableRowCell>

        <TableRowCell>
          <TagListConnector
            tags={tags}
          />
        </TableRowCell>
      </TableRow>
    );
  }
}

ArtistEditorRow.propTypes = {
  id: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  nameSlug: PropTypes.string.isRequired,
  artistName: PropTypes.string.isRequired,
  monitored: PropTypes.bool.isRequired,
  languageProfile: PropTypes.object.isRequired,
  qualityProfile: PropTypes.object.isRequired,
  albumFolder: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.number).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  isSelected: PropTypes.bool,
  onSelectedChange: PropTypes.func.isRequired
};

export default ArtistEditorRow;