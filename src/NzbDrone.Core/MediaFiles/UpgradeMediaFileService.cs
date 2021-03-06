using System.IO;
using System.Linq;
using NLog;
using NzbDrone.Common.Disk;
using NzbDrone.Common.Extensions;
using NzbDrone.Core.Parser.Model;

namespace NzbDrone.Core.MediaFiles
{
    public interface IUpgradeMediaFiles
    {
        TrackFileMoveResult UpgradeTrackFile(TrackFile trackFile, LocalTrack localTrack, bool copyOnly = false);
    }

    public class UpgradeMediaFileService : IUpgradeMediaFiles
    {
        private readonly IRecycleBinProvider _recycleBinProvider;
        private readonly IMediaFileService _mediaFileService;
        private readonly IMoveTrackFiles _trackFileMover;
        private readonly IDiskProvider _diskProvider;
        private readonly Logger _logger;

        public UpgradeMediaFileService(IRecycleBinProvider recycleBinProvider,
                                       IMediaFileService mediaFileService,
                                       IMoveTrackFiles trackFileMover,
                                       IDiskProvider diskProvider,
                                       Logger logger)
        {
            _recycleBinProvider = recycleBinProvider;
            _mediaFileService = mediaFileService;
            _trackFileMover = trackFileMover;
            _diskProvider = diskProvider;
            _logger = logger;
        }

        public TrackFileMoveResult UpgradeTrackFile(TrackFile trackFile, LocalTrack localTrack, bool copyOnly = false)
        {
            var moveFileResult = new TrackFileMoveResult();
            var existingFiles = localTrack.Tracks
                                            .Where(e => e.TrackFileId > 0)
                                            .Select(e => e.TrackFile.Value)
                                            .GroupBy(e => e.Id);

            foreach (var existingFile in existingFiles)
            {
                var file = existingFile.First();
                var trackFilePath = Path.Combine(localTrack.Artist.Path, file.RelativePath);
                var subfolder = _diskProvider.GetParentFolder(localTrack.Artist.Path).GetRelativePath(_diskProvider.GetParentFolder(trackFilePath));

                if (_diskProvider.FileExists(trackFilePath))
                {
                    _logger.Debug("Removing existing track file: {0}", file);
                    _recycleBinProvider.DeleteFile(trackFilePath, subfolder);
                }

                moveFileResult.OldFiles.Add(file);
                _mediaFileService.Delete(file, DeleteMediaFileReason.Upgrade);
            }

            if (copyOnly)
            {
                moveFileResult.TrackFile = _trackFileMover.CopyTrackFile(trackFile, localTrack);
            }
            else
            {
                moveFileResult.TrackFile = _trackFileMover.MoveTrackFile(trackFile, localTrack);
            }

            return moveFileResult;
        }
    }
}
