import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Text
} from '@react-email/components'

interface RaycastMagicLinkEmailProps {
	name?: string
}

const baseUrl = process.env.VERCEL_URL ? `https://${import.meta.env.BASE_URL}` : ''

export const RaycastMagicLinkEmail = ({ name }: RaycastMagicLinkEmailProps) => (
	<Html>
		<Head />
		<Preview>Log in with this magic link.</Preview>
		<Body style={main}>
			<Container style={container}>
				<Img src={`${baseUrl}/static/email-logo.png`} width={48} height={48} alt='Raycast' />
				<Heading style={heading}>Thanks!</Heading>
				<Section style={body}>
					<Text style={paragraph}>Thanks for getting in contact, {name}!</Text>
					<Text style={paragraph}>I'll be sure to reply as soon as possible.</Text>
				</Section>
				<Text style={paragraph}>
					Sincerely,
					<br />- Michael Payne
				</Text>
				<Hr style={hr} />
				<Img
					src={`${baseUrl}/static/raycast-logo.png`}
					width={32}
					height={32}
					style={{
						WebkitFilter: 'grayscale(100%)',
						filter: 'grayscale(100%)',
						margin: '20px 0'
					}}
				/>
				<Text style={footer}>Michael Payne ltd.</Text>
			</Container>
		</Body>
	</Html>
)

RaycastMagicLinkEmail.PreviewProps = {
	magicLink: 'https://raycast.com'
} as RaycastMagicLinkEmailProps

export default RaycastMagicLinkEmail

const main = {
	backgroundColor: '#ffffff',
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
}

const container = {
	margin: '0 auto',
	padding: '20px 25px 48px',
	backgroundImage: 'url("/assets/raycast-bg.png")',
	backgroundPosition: 'bottom',
	backgroundRepeat: 'no-repeat, no-repeat'
}

const heading = {
	fontSize: '28px',
	fontWeight: 'bold',
	marginTop: '48px'
}

const body = {
	margin: '24px 0'
}

const paragraph = {
	fontSize: '16px',
	lineHeight: '26px'
}

const link = {
	color: '#FF6363'
}

const hr = {
	borderColor: '#dddddd',
	marginTop: '48px'
}

const footer = {
	color: '#8898aa',
	fontSize: '12px',
	marginLeft: '4px'
}
