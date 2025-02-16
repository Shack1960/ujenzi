import { Box, Container, Grid, Link, Typography } from '@mui/material';
import { styled } from '@mui/system';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(6, 0),
  marginTop: 'auto',
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const Footer = () => {
  return (
    <FooterContainer>

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Ujenzi
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Version 1.0.0
            </Typography>
            <Typography variant="body2" color="textSecondary" mt={2}>
              © {new Date().getFullYear()} Ujenzi Platform. All rights reserved.
              Built with ❤️ by the Ujenzi team.

            </Typography>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" gutterBottom>
              Resources
            </Typography>
            <FooterLink href="#" variant="body2" display="block">
              Documentation
            </FooterLink>
            <FooterLink href="#" variant="body2" display="block">
              Support
            </FooterLink>
            <FooterLink href="#" variant="body2" display="block">
              API Reference
            </FooterLink>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" gutterBottom>
              Legal
            </Typography>
            <FooterLink href="#" variant="body2" display="block">
              Privacy Policy
            </FooterLink>
            <FooterLink href="#" variant="body2" display="block">
              Terms of Service
            </FooterLink>
            <FooterLink href="#" variant="body2" display="block">
              Cookie Policy
            </FooterLink>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>
              Connect With Us
            </Typography>
            <Box>
              <FooterLink href="#" variant="body2" mr={2}>
                Twitter
              </FooterLink>
              <FooterLink href="#" variant="body2" mr={2}>
                LinkedIn
              </FooterLink>
              <FooterLink href="#" variant="body2">
                GitHub
              </FooterLink>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
