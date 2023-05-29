import React from "react";
import {
  ImageListItem,
  Modal,
  Container,
  Stack,
  IconButton,
  Typography,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

interface PortfolioImageProps {
  imageData: Array<{ id: string; order: number; description: string }>;
  originalDescription: string;
  originalImageId: string;
}

interface PortfolioImageState {
  description: string;
  imageId: string;
  isModalOpen: boolean;
}

export default class PortfolioImage extends React.Component<
  PortfolioImageProps,
  PortfolioImageState
> {
  constructor(props: PortfolioImageProps) {
    super(props);

    this.state = {
      description: props.originalDescription,
      imageId: props.originalImageId,
      isModalOpen: false,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleKeyDownMove = this.handleKeyDownMove.bind(this);
  }

  render() {
    const { imageData, originalImageId } = this.props;
    const { description, imageId, isModalOpen } = this.state;

    const imagePosition = this.getImageIdPosition(imageId, imageData);
    const isMobile = window.innerWidth < 600; // Primitive, but it works for what I need

    return (
      <div>
        <ImageListItem
          onClick={() => (isMobile ? null : this.openModal())} // Don't open the modal on mobile since it looks horrible
          key={uuidv4()}
          sx={{ aspectRatio: "1", p: 1 }}
        >
          <img
            src={`https://backend.xsalazar.com/images/${originalImageId}`} // We always want this to be the original image
            style={{ objectFit: "cover" }}
            height={256}
            alt="description"
          />
        </ImageListItem>

        {/* Modal */}
        <Modal
          open={isModalOpen}
          onClose={this.closeModal}
          onKeyDown={(event) => this.handleKeyDownMove(event, imageId)}
        >
          <Container
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 2,
            }}
          >
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              {/* Back button */}
              <IconButton
                onClick={() => this.handleMove(imageId, false)}
                disabled={imagePosition === 0}
              >
                <ArrowBack />
              </IconButton>
              {/* Image and description */}
              <Stack
                direction="column"
                justifyContent="center"
                alignContent="center"
                spacing={2}
              >
                <img
                  width="100%"
                  src={`https://backend.xsalazar.com/images/${imageId}`}
                  alt="description"
                  style={{ verticalAlign: "middle" }}
                />
                <Typography variant="caption">{description}</Typography>
              </Stack>
              {/* Forward button */}
              <IconButton
                onClick={() => this.handleMove(imageId, true)}
                disabled={imagePosition === imageData.length - 1}
              >
                <ArrowForward />
              </IconButton>
            </Stack>
          </Container>
        </Modal>
      </div>
    );
  }

  openModal() {
    this.setState({
      isModalOpen: true,
    });
  }

  closeModal() {
    this.setState({
      imageId: this.props.originalImageId, // Reset the modal to "forget" if we navigated away
      isModalOpen: false,
    });
  }

  handleMove(imageId: string, forward: boolean) {
    let { imageData } = this.props;

    const currentImagePosition = this.getImageIdPosition(imageId, imageData);
    const newImagePosition = currentImagePosition + (forward ? 1 : -1);
    const newImage = this.findImageAtPosition(newImagePosition, imageData);

    this.setState({
      description: newImage.description,
      imageId: newImage.id,
    });
  }

  handleKeyDownMove(event: React.KeyboardEvent, imageId: string) {
    let { imageData } = this.props;

    const currentImagePosition = this.getImageIdPosition(imageId, imageData);
    if (event.key === "ArrowLeft" && currentImagePosition !== 0) {
      this.handleMove(imageId, false);
    } else if (
      event.key === "ArrowRight" &&
      currentImagePosition !== imageData.length - 1
    ) {
      this.handleMove(imageId, true);
    }
  }

  private getImageIdPosition(
    needleId: string,
    imageData: Array<{ id: string; order: number }>
  ): number {
    return imageData.find(({ id: haystackId }) => needleId === haystackId)!
      .order;
  }

  private findImageAtPosition(
    needlePosition: number,
    imageData: Array<{ id: string; order: number; description: string }>
  ): {
    description: string;
    id: string;
    order: number;
  } {
    return imageData.find(
      ({ order: haystackPosition }) => needlePosition === haystackPosition
    )!;
  }
}
