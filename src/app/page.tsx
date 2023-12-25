import styles from './page.module.css'
import InputForm from "@/components/InputForm";
import DispenserTable from "@/components/DispenserTable";

export default function Home() {
  return (
    <main className={styles.main}>
      <InputForm/>
        {/*<DispenserTable/>*/}
    </main>
  )
}
