
# Odoo Management Commands and Troubleshooting

This README provides commands and instructions for managing the Odoo instance, including database handling, script execution, log viewing, and troubleshooting steps.

---

## Prerequisites

Ensure that you have the following prerequisites before executing the commands:

- **User Permissions**: User `mariomaghed512` has permissions to execute certain commands.
- **Database Access**: Make sure that the PostgreSQL service is running.
- **Script File**: `manage_odoo.sh` script should have executable permissions.

## Command List

### 1. Managing the Odoo Database

- **Login to PostgreSQL as postgres user**:
  ```bash
  sudo -u postgres psql
  ```

- **List all available databases**:
  ```sql
  \l
  ```

- **Connect to a specific database** (e.g., `Est_prd04`):
  ```sql
  \c Est_prd04
  ```

- **Change the owner of the database** to `odoo`:
  ```sql
  ALTER DATABASE Est_prd04 OWNER TO odoo;
  ```

- **Check PostgreSQL status**:
  ```bash
  sudo systemctl status postgresql
  ```

### 2. Managing the Odoo Service

- **Start the Odoo service**:
  ```bash
  sudo systemctl start odoo
  ```

- **Stop the Odoo service**:
  ```bash
  sudo systemctl stop odoo
  ```

- **Restart the Odoo service**:
  ```bash
  sudo systemctl restart odoo
  ```

- **View Odoo service status**:
  ```bash
  sudo systemctl status odoo
  ```

### 3. Using the `manage_odoo.sh` Script

The `manage_odoo.sh` script helps to manage Odoo without using systemd.

- **Make the script executable**:
  ```bash
  sudo chmod +x manage_odoo.sh
  ```

- **Start Odoo using the script**:
  ```bash
  ./manage_odoo.sh start
  ```

- **Stop Odoo using the script**:
  ```bash
  ./manage_odoo.sh stop
  ```

- **Check Odoo's status using the script**:
  ```bash
  ./manage_odoo.sh status
  ```

### 4. Log Management and Debugging

- **View Odoo logs in real-time**:
  ```bash
  tail -f /home/mariomaghed512/odoo.log
  ```

- **View Odoo logs using journalctl**:
  ```bash
  sudo journalctl -u odoo
  ```

### 5. Network and Port Checks

- **Check which process is using port 8069**:
  ```bash
  sudo lsof -i :8069
  ```

- **Kill a specific process by PID** (useful if Odoo is running unexpectedly):
  ```bash
  sudo kill -9 <PID>
  ```

### 6. Miscellaneous PostgreSQL and Odoo Commands

- **Check PostgreSQL service status and ensure it's running**:
  ```bash
  sudo systemctl status postgresql
  ```

- **Restart PostgreSQL service if necessary**:
  ```bash
  sudo systemctl restart postgresql
  ```

### 7. Checking Odoo Connections

- **List connected users on Odoo database**:
  ```sql
  SELECT * FROM pg_stat_activity WHERE datname = 'Est_prd04';
  ```

---

## Common Errors and Solutions

- **FileNotFoundError for Filestore**: 
  Ensure the `data_dir` in the `odoo.conf` file points to the correct location of the filestore. Verify the permissions and ownership of this directory.

- **Permission Issues with Logs**:
  Make sure the log file (`/home/mariomaghed512/odoo.log`) has the appropriate write permissions for the executing user.

- **Database Not Reachable Error**:
  If the `manage_odoo.sh` script reports "Database not reachable," ensure PostgreSQL is running and accessible on `localhost:5432`.

---

## Example Execution Flow

1. **Start the database check**:
   ```bash
   ./manage_odoo.sh start
   ```

2. **Verify Odoo's activity and connections**:
   ```sql
   SELECT * FROM pg_stat_activity WHERE datname = 'Est_prd04';
   ```

3. **View logs for any startup errors**:
   ```bash
   tail -f /home/mariomaghed512/odoo.log
   ```

This should cover the main aspects of managing and troubleshooting the Odoo instance.
