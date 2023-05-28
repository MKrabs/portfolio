import { v4 as uuidv4 } from "uuid";
import { Box, Container, Typography } from "@mui/material";
import { imageListItemClasses } from "@mui/material/ImageListItem";
import axios from "axios";
import React from "react";
import PortfolioImage from "./image";

interface PortfolioProps {}

interface PortfolioState {
  imageData: Array<{ id: string; order: number }>;
}

export default class Body extends React.Component<
  PortfolioProps,
  PortfolioState
> {
  constructor(props: PortfolioProps) {
    super(props);

    this.state = {
      imageData: [],
    };
  }

  async componentDidMount(): Promise<void> {
    const result = (
      await axios.get(`https://backend.xsalazar.com/`, {
        params: { allImages: true },
      })
    ).data;

    this.setState({
      imageData: result.data,
    });
  }

  render() {
    const { imageData } = this.state;

    return (
      <div style={{ height: "calc(100vh - 200px)" }}>
        <Container
          maxWidth="md"
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Typography variant="h3" sx={{ marginRight: "auto" }}>
            Xavier Salazar
          </Typography>
          <Typography variant="caption" sx={{ marginRight: "auto" }}>
            Digital and film photography
          </Typography>
          <Box
            sx={{
              mt: 2,
              height: "calc(100vh - 250px)",
              overflowY: "auto",
              justifyItems: "center",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(3, 1fr)",
                },
                [`& .${imageListItemClasses.root}`]: {
                  display: "flex",
                },
              }}
            >
              {imageData.map(({ id }) => {
                return (
                  <PortfolioImage
                    originalImageId={id}
                    imageData={imageData}
                    key={uuidv4()}
                  />
                );
              })}
            </Box>
          </Box>
        </Container>
      </div>
    );
  }
}
