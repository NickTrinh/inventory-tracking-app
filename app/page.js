'use client'

import * as React from 'react'
import { firestore } from '@/firebase'
import { useEffect, useState } from 'react'
import {
	ListItemButton,
	ListItemText,
	ListItem,
	List,
	Drawer,
	Box,
	Stack,
	Typography,
	Button,
	Modal,
	TextField,
	Table,
	TableContainer,
	TableHead,
	TableBody,
	TableCell,
	TableRow,
	Paper,
	InputAdornment,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { getDocs, doc, query, collection, setDoc, deleteDoc, getDoc } from 'firebase/firestore'

const popupStyle = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 500,
	bgcolor: 'white',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
	display: 'flex',
	flexDirection: 'column',
	gap: 3,
}

export default function Home() {
	const [inventory, setInventory] = useState([])
	const [searchQuery, setSearchQuery] = useState('')
	const [open, setOpen] = useState(false)
	const [itemName, setItemName] = useState('')
	const [quantity, setQuantity] = useState()
	const [editOpen, setEditOpen] = useState(false)
	const [currentItem, setCurrentItem] = useState('')
	const filteredInventory = inventory.filter((item) =>
		item.name.toLowerCase().includes(searchQuery)
	)

	const updateInventory = async () => {
		const snapshot = query(collection(firestore, 'inventory'))
		const docs = await getDocs(snapshot)
		const inventoryList = []
		docs.forEach((doc) => {
			inventoryList.push({ name: doc.id, ...doc.data() })
		})
		setInventory(inventoryList)
	}

	useEffect(() => {
		updateInventory()
	}, [])

	const addItem = async (item, quantity) => {
		const docRef = doc(collection(firestore, 'inventory'), item)
		const docSnap = await getDoc(docRef)
		if (docSnap.exists()) {
			const currentQuantity = docSnap.data().quantity
			const newQuantity = currentQuantity + quantity
			const docData = {
				name: item,
				quantity: newQuantity,
			}
			await setDoc(docRef, docData)
			updateInventory()
			return
		}

		const docData = {
			name: item,
			quantity: quantity,
		}

		await setDoc(docRef, docData)
		updateInventory()
	}

	const removeItem = async (item, quantity) => {
		const docRef = doc(collection(firestore, 'inventory'), item)
		const docSnap = await getDoc(docRef)
		if (docSnap.exists()) {
			const currentQuantity = docSnap.data().quantity
			const newQuantity = currentQuantity - quantity
			if (newQuantity <= 0) {
				await deleteDoc(docRef)
			} else {
				const docData = {
					name: item,
					quantity: newQuantity,
				}
				await setDoc(docRef, docData)
			}
		}
		await updateInventory()
	}

	const handleAddNewOpen = () => setOpen(true)
	const handleAddNewClose = () => setOpen(false)

	const handleEditOpen = (item) => {
		setCurrentItem(item)
		setEditOpen(true)
	}
	const handleEditClose = () => setEditOpen(false)

	return (
		<Stack
			direction="row"
			sx={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'center',
				alignItems: 'center',
				width: '100%',
				height: '100vh',
			}}
			backgroundColor="#fefefe"
		>
			<div>
				<Drawer
					component={Paper}
					sx={{
						width: 240,
						flexShrink: 0,
						'& .MuiDrawer-paper': {
							width: 240,
							boxSizing: 'border-box',
						},
					}}
					variant="permanent"
					anchor="left"
				>
					<Box role="presentation">
						<List>
							<ListItem key={'Your Inventory'} disablePadding>
								<ListItemButton>
									<ListItemText primary={'Your Inventory'} />
								</ListItemButton>
							</ListItem>
							<ListItem key={'Recipe Suggestions'} disablePadding>
								<ListItemButton>
									<ListItemText primary={'Recipe Suggestions'} />
								</ListItemButton>
							</ListItem>
						</List>
					</Box>
				</Drawer>
			</div>

			<Stack sx={{ display: 'flex', width: '100%', height: '100%' }}>
				<Modal
					open={open}
					onClose={handleAddNewClose}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box sx={popupStyle}>
						<Typography id="modal-modal-title" variant="h6" component="h2">
							Add Item
						</Typography>
						<Stack width="100%" direction={'row'} spacing={2}>
							<TextField
								id="outlined-basic"
								label="Item"
								variant="outlined"
								fullWidth
								value={itemName}
								onChange={(e) => setItemName(e.target.value)}
							/>
							<Button
								variant="outlined"
								onClick={() => {
									addItem(itemName, 1)
									setItemName('')
									handleAddNewClose()
								}}
							>
								Add
							</Button>
						</Stack>
					</Box>
				</Modal>

				<Modal
					open={editOpen}
					onClose={handleEditClose}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box sx={popupStyle}>
						<Typography id="modal-modal-title" variant="h6" component="h2">
							Edit Item
						</Typography>
						<Stack width="100%" direction={'row'} spacing={2}>
							<TextField
								id="outlined-basic"
								label="Enter quantity"
								variant="outlined"
								fullWidth
								value={quantity}
								onChange={(e) => setQuantity(Number(e.target.value))}
							/>
							<Button
								variant="outlined"
								onClick={() => {
									addItem(currentItem, quantity)
									setQuantity()
									handleEditClose()
								}}
							>
								Add
							</Button>
							<Button
								variant="outlined"
								onClick={() => {
									removeItem(currentItem, quantity)
									setQuantity()
									handleEditClose()
								}}
							>
								Remove
							</Button>
						</Stack>
					</Box>
				</Modal>

				<Stack
					direction="row"
					spacing={2}
					sx={{
						padding: 10,
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Button variant="contained" onClick={handleAddNewOpen}>
						Add New Item
					</Button>
					<TextField
						sx={{ width: '500px' }}
						id="outlined-basic"
						label="Search"
						variant="outlined"
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value.toLowerCase())
						}}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
						}}
					/>
				</Stack>

				<Stack height={'100%'} alignItems={'center'} justifyContent={'center'}>
					<TableContainer
						component={Paper}
						sx={{ width: '90%', height: '90%', border: 1, borderColor: '#000' }}
					>
						<Table variant="outlined" aria-label="basic table" sx={{ padding: 10 }}>
							<TableHead sx={{ background: '#f8f8f8' }}>
								<TableRow>
									<TableCell align="center">Name</TableCell>
									<TableCell align="center">Quantity</TableCell>
									<TableCell align="center"></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{filteredInventory.map(({ name, quantity }) => (
									<TableRow key={name} sx={{ height: 50 }}>
										<TableCell align="center" component="th" scope="row">
											{name}
										</TableCell>
										<TableCell align="center">{quantity}</TableCell>
										<TableCell align="center">
											<Button variant="outlined" onClick={() => handleEditOpen(name)}>
												Edit
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Stack>
			</Stack>
		</Stack>
	)
}
