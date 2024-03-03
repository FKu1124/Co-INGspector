import { Button, Modal, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import TableView from './TableView';

const TITLES = [
    "Timestamp",
    "Bank Org",
    "Account Org",
    "Bank Dest",
    "Account Dest",
    "Amount Received",
    "Receiving Currency",
    "Amount Paid",
    "Payment Currency",
    "Payment Format"
]

const placeholder = [
    {
        "Timestamp": "",
        "From Bank": 0,
        "Account": "",
        "To Bank": 0,
        "Account.1": "",
        "Amount Received": 0.0,
        "Receiving Currency": "",
        "Amount Paid": 0.0,
        "Payment Currency": "",
        "Payment Format": ""
    }
]

export default function InspectModal({ tx, updateTransactions, addToastNotifications }) {
    const [openModal, setOpenModal] = useState(false);
    const [transactions, setTransactions] = useState(["Default"])

    const getAccountData = async () => {
        const res = await fetch(`http://localhost:8012/getTransactionsByAccount/${tx["Account"]}`)
        const data = await res.json()
        setTransactions(data)
        console.log(data)
        setOpenModal(true)
    }

    const dismissAlert = () => {
        removePossibleFraudTrans()
        updateTransactions(tx["Account"])
        setOpenModal(false)
        addToastNotifications(`Dismissed Transaction of Account ${tx["Account"]}`)
    }

    const blockPerma = () => {
        removePossibleFraudTrans()
        updateTransactions(tx["Account"])
        setOpenModal(false)
        addToastNotifications(`Blocked Transaction of Account ${tx["Account"]} Permanently`)
    }

    const reportToAuth = () => {
        removePossibleFraudTrans()
        updateTransactions(tx["Account"])
        setOpenModal(false)
        addToastNotifications(`Reported Account ${tx["Account"]} to Authorities`)
    }

    const removePossibleFraudTrans = async () => {
        const res = await fetch(`http://localhost:8012/removePossibleFraudTrans`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tx)
        })
        const data = await res.json()
        setNotificationCounter(data.notifications)
    }


    return (
        <>
            <a onClick={() => getAccountData()} className='font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer'>Open</a>
            <Modal dismissible size="7xl" show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>Detailed Overview for Account - {transactions[0].Account}</Modal.Header>
                <Modal.Body>
                    <div className="flex flex-row justify-between mb-10 ml-2 mr-5 text-lg font-medium">
                        <div className="flex flex-row">
                            <p>Reason(s) for Flagging:</p>
                            <ul className="list-disc ml-10">
                                <li>Number of Currencies</li>
                                <li>Number of Payment Formats</li>
                                <li>Matching Paid - Received</li>
                                <li>Number of Transactions in Timeframe</li>
                                <li>Fraudulent Pattern</li>
                                <li>Loop</li>
                                <li>Stack</li>
                                <li>Scatter / Gather</li>
                                <li>Fan-In</li>
                                <li>Fan-Out</li>
                                <li>Undefined</li>
                            </ul>
                        </div>

                        <div className="flex flex-col w-96">
                            <div className="flex flex-row justify-between">
                                <p>Approx. Turnover Past 1 Month:</p>
                                <p>€190,000.00</p>
                            </div>
                            <div className="flex flex-row justify-between">
                                <p>Avg. Transaction Volume:</p>
                                <p>€11,563.22</p>
                            </div>
                            <div className="flex flex-row justify-between">
                                <p>No. of Involved Currencies:</p>
                                <p>5</p>
                            </div>
                        </div>
                    </div>

                    <Table striped>
                        <Table.Head>
                            {TITLES.map((title, i) => (
                                <Table.HeadCell key={`header-${i}`}>{title}</Table.HeadCell>
                            ))}
                            <Table.HeadCell>
                                <span className="sr-only">Edit</span>
                            </Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {transactions.map((tx, i) => (
                                <Table.Row key={`row-${i}`} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>{tx["Timestamp"]}</Table.Cell>
                                    <Table.Cell>{tx["From Bank"]}</Table.Cell>
                                    <Table.Cell>{tx["Account"]}</Table.Cell>
                                    <Table.Cell>{tx["To Bank"]}</Table.Cell>
                                    <Table.Cell>{tx["Account.1"]}</Table.Cell>
                                    <Table.Cell>{tx["Amount Received"]}</Table.Cell>
                                    <Table.Cell>{tx["Receiving Currency"]}</Table.Cell>
                                    <Table.Cell>{tx["Amount Paid"]}</Table.Cell>
                                    <Table.Cell>{tx["Payment Currency"]}</Table.Cell>
                                    <Table.Cell>{tx["Payment Format"]}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    <div className="flex flex-row items-center justify-center">
                        <a className="flex flex-row items-center justify-center cursor-pointer hover:text-sky-500 w-48">View More
                            <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                            </svg>
                        </a>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button color="blue" onClick={() => dismissAlert()}>Dismiss Alert</Button>
                    <Button color="warning" onClick={() => blockPerma()}>Block Permanently</Button>
                    <Button color="failure" onClick={() => reportToAuth()}>Report Suspected Money Laundering</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
