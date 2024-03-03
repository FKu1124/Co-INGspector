
import { Table, Pagination, Spinner, Toast } from 'flowbite-react';
import { useEffect, useState } from 'react';
import InspectModal from './InspectModal';

const TITLES = [
    "Alert ID",
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

const ELEMS = 10

export default function TableView({ setNotificationCounter, addToastNotifications }) {

    const [isLoading, setIsLoading] = useState(false)
    const [critTransactions, setCritTransactions] = useState(new Array(ELEMS).fill(placeholder))
    const [transactions, setTransactions] = useState([])
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        setIsLoading(true)
        const res = await fetch(`http://localhost:8012/getData`)
        const data = await res.json()
        setTransactions(data)
        setCritTransactions(data.slice(0, 10))
        setIsLoading(false)
        setNotificationCounter(data.length)
    }

    const onPageChange = (page) => {
        setCurrentPage(page)
        setCritTransactions(transactions.slice((page - 1) * ELEMS, page * ELEMS))
        setNotificationCounter(transactions.length)
    }

    function updateTransactions(id) {
        const x = transactions.filter((item) => {
            return item.Account.trim() !== id.trim()
        })
        setTransactions(x)
        setCritTransactions(x.slice(0, ELEMS))
        setNotificationCounter(x.length)
    }

    if (critTransactions.length == 0) {
        return (
            <h1 className="text-4xl">
                No Work Today 🎉
            </h1>
        )
    }
    return (
        <div>
            <Table striped>
                <Table.Head>
                    {TITLES.map((title, i) => (
                        <Table.HeadCell key={`header-${i}`}>{title}</Table.HeadCell>
                    ))}
                    <Table.HeadCell>
                        <span className="sr-only">Edit</span>
                    </Table.HeadCell>
                </Table.Head>
                {isLoading ? (
                    <div className="absolute inset-0 flex justify-center items-center bg-slate-500 opacity-50">
                        <Spinner aria-label="Default status example" />
                        <p>Loading...</p>
                    </div>
                ) : <></>}
                <Table.Body className="divide-y z-10">
                    {critTransactions.map((tx, i) => (
                        <Table.Row key={`row-${i}`} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{i + currentPage * ELEMS - ELEMS + 1}</Table.Cell>
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

                            <Table.Cell>
                                <InspectModal tx={tx} updateTransactions={updateTransactions} addToastNotifications={addToastNotifications} />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            <div className="flex overflow-x-auto sm:justify-center">
                <Pagination currentPage={currentPage} totalPages={3} onPageChange={onPageChange} showIcons />
            </div>
        </div>
    );
}
